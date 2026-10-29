#!/usr/bin/env node
// One-command deploy for Document Dash.
//
//   npm run deploy                 build for the sub-path, upload over SSH, install, reload nginx
//   npm run deploy:rollback        point the server back at the previous release
//   npm run deploy:admin           set the kiosk admin ID/password that logs kiosks in
//   npm run deploy -- --dry-run    build and prepare everything, print what would run, connect to nothing
//
// Settings: deploy/deploy.env (copy deploy/deploy.env.example). The server side is
// deploy/remote-install.sh; the nginx snippet is generated from deploy/nginx/document_dash.conf.template.
// Needs ssh, scp and tar on this machine (built into Windows 10+, macOS and Linux).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha512Crypt } from './sha512-crypt.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DEPLOY_DIR = path.join(ROOT, 'deploy');
const flags = new Set(process.argv.slice(2));
const ROLLBACK = flags.has('--rollback');
const SET_ADMIN = flags.has('--set-admin');
const DRY_RUN = flags.has('--dry-run');

const fail = (message) => {
  console.error(`\n✖ ${message}`);
  process.exit(1);
};
const step = (message) => console.log(`\n▶ ${message}`);

// Windows checkouts may hold CRLF line endings; the server's bash and nginx need LF
const readLf = (file) => fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

// Single-quotes a value for the server's POSIX shell
const shq = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`;

function readConfig() {
  let file = path.join(DEPLOY_DIR, 'deploy.env');
  if (!fs.existsSync(file)) {
    if (!DRY_RUN) fail('Missing deploy/deploy.env. Copy deploy/deploy.env.example to deploy/deploy.env and fill it in.');
    file = path.join(DEPLOY_DIR, 'deploy.env.example');
  }

  const env = {};
  for (const line of readLf(file).split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }

  const basePath = (env.DEPLOY_BASE_PATH || '/document_dash').replace(/\/+$/, '');
  const publicUrl = env.DEPLOY_PUBLIC_URL || '';
  const config = {
    host: env.DEPLOY_HOST,
    user: env.DEPLOY_USER,
    port: env.DEPLOY_PORT || '22',
    sshKey: env.DEPLOY_SSH_KEY || '',
    basePath,
    appName: basePath.slice(1),
    appDir: env.DEPLOY_APP_DIR || `/opt${basePath}`,
    webRoot: (env.DEPLOY_WEB_ROOT || '/var/www/apps').replace(/\/+$/, ''),
    snippet: env.DEPLOY_NGINX_SNIPPET || `/etc/nginx/snippets/${basePath.slice(1)}.conf`,
    htpasswd: env.DEPLOY_NGINX_HTPASSWD || `/etc/nginx/${basePath.slice(1)}.htpasswd`,
    tokenFile: env.DEPLOY_KIOSK_TOKEN_FILE || `/etc/nginx/${basePath.slice(1)}.kiosk-token`,
    // Browsers only keep Secure cookies from https:// sites
    cookieSecure: env.DEPLOY_COOKIE_SECURE || (/^http:\/\//i.test(publicUrl) ? 'false' : 'true'),
    keepReleases: env.DEPLOY_KEEP_RELEASES || '5',
    useSudo: env.DEPLOY_USE_SUDO || 'true',
    publicUrl
  };

  if (!config.host || !config.user) fail('DEPLOY_HOST and DEPLOY_USER must be set in deploy/deploy.env');
  if (!DRY_RUN && config.host === 'your.server.example') fail('deploy/deploy.env still has the example DEPLOY_HOST');
  if (!/^\/[A-Za-z0-9_-]+$/.test(basePath)) fail('DEPLOY_BASE_PATH must be one path segment, like /document_dash');
  for (const [name, value] of [
    ['DEPLOY_APP_DIR', config.appDir],
    ['DEPLOY_WEB_ROOT', config.webRoot],
    ['DEPLOY_NGINX_SNIPPET', config.snippet],
    ['DEPLOY_NGINX_HTPASSWD', config.htpasswd],
    ['DEPLOY_KIOSK_TOKEN_FILE', config.tokenFile]
  ]) {
    if (!/^\/[A-Za-z0-9_./-]+$/.test(value)) fail(`${name} must be an absolute server path`);
  }
  if (!['true', 'false'].includes(config.cookieSecure)) fail('DEPLOY_COOKIE_SECURE must be true or false');
  if (!/^\d+$/.test(config.keepReleases) || Number(config.keepReleases) < 1) fail('DEPLOY_KEEP_RELEASES must be a positive number');
  return config;
}

// Runs a local command. Remote ones (ssh/scp) are only printed in a dry run.
function run(command, args, { remote = false, ...options } = {}) {
  if (DRY_RUN && remote) {
    console.log(`  [dry run] ${command} ${args.map(a => (/\s/.test(a) ? JSON.stringify(a) : a)).join(' ')}`);
    return 0;
  }
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) fail(`could not run ${command}: ${result.error.message}`);
  return result.status;
}

const sshArgs = (config) => ['-p', config.port, ...(config.sshKey ? ['-i', config.sshKey] : [])];
const scpArgs = (config) => ['-P', config.port, ...(config.sshKey ? ['-i', config.sshKey] : [])];

function build(config) {
  step(`Building for ${config.basePath}/`);
  const vite = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');
  if (!fs.existsSync(vite)) fail('dependencies are missing; run npm install first');
  const status = run(process.execPath, [vite, 'build'], {
    cwd: ROOT,
    env: { ...process.env, BASE_PATH: `${config.basePath}/` }
  });
  if (status !== 0) fail('the build failed');

  const html = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  if (!html.includes(`${config.basePath}/assets/`)) {
    fail(`dist/index.html doesn't load its files from ${config.basePath}/; check base in vite.config.js`);
  }
  if (!fs.existsSync(path.join(ROOT, 'dist', 'login', 'index.html'))) fail('dist/login/index.html is missing; check public/login/');
}

// Copies the server script into workDir and returns its name there
function stageScript(workDir, tag) {
  const script = `${tag}-install.sh`;
  fs.writeFileSync(path.join(workDir, script), readLf(path.join(DEPLOY_DIR, 'remote-install.sh')));
  return script;
}

// Writes the build archive, nginx snippet and server script into workDir under unique names
function stage(config, workDir, tag) {
  step('Packaging the build and generating the nginx snippet');
  const files = {
    archive: `${tag}-build.tgz`,
    snippet: `${tag}-nginx.conf`,
    script: stageScript(workDir, tag)
  };

  // tar gets a relative archive name: GNU tar would read "C:\..." as host:path
  if (run('tar', ['-czf', files.archive, '-C', path.join(ROOT, 'dist'), '.'], { cwd: workDir }) !== 0) {
    fail('packaging the build with tar failed');
  }

  // __KIOSK_TOKEN__ stays in: the server fills in its own secret token
  const snippet = readLf(path.join(DEPLOY_DIR, 'nginx', 'document_dash.conf.template'))
    .replaceAll('__BASE__', config.basePath)
    .replaceAll('__WEB_ROOT__', config.webRoot)
    .replaceAll('__SNIPPET_PATH__', config.snippet)
    .replaceAll('__HTPASSWD__', config.htpasswd)
    .replaceAll('__COOKIE_SECURE__', config.cookieSecure === 'true' ? '; Secure' : '');
  fs.writeFileSync(path.join(workDir, files.snippet), snippet);
  return files;
}

// Reads one line from the terminal; hidden input shows nothing as it is typed
function prompt(question, { hidden = false } = {}) {
  const { stdin, stdout } = process;
  return new Promise((resolve) => {
    let value = '';
    const finish = () => {
      stdin.off('data', onData);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
    };
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === '\r' || char === '\n') {
          finish();
          resolve(value);
          return;
        }
        if (char === '\u0003') {
          finish();
          process.exit(130);
        }
        if (char === '\u001b') return; // arrow and other special keys
        if (char === '\u007f' || char === '\b') {
          if (value && !hidden) stdout.write('\b \b');
          value = Array.from(value).slice(0, -1).join('');
        } else if (char >= ' ') {
          value += char;
          if (!hidden) stdout.write(char);
        }
      }
    };
    stdout.write(question);
    stdin.setRawMode(true);
    stdin.setEncoding('utf8');
    stdin.on('data', onData);
    stdin.resume();
  });
}

// Asks for the kiosk admin ID and password and returns nginx's "ID:hash" line. Setting
// DEPLOY_ADMIN_ID and DEPLOY_ADMIN_PASSWORD in the environment skips the questions.
async function readAdminLogin() {
  let id = process.env.DEPLOY_ADMIN_ID || '';
  let password = process.env.DEPLOY_ADMIN_PASSWORD || '';
  if (!id || !password) {
    if (!process.stdin.isTTY) fail('run this in a terminal, or set DEPLOY_ADMIN_ID and DEPLOY_ADMIN_PASSWORD');
    console.log('\nStaff enter this ID and password once on each kiosk to let it open the game.');
    id = (await prompt('Admin ID: ')).trim();
    password = await prompt('Password (at least 8 characters, not shown): ', { hidden: true });
    if (password !== await prompt('Password again: ', { hidden: true })) fail('the passwords did not match');
  }
  if (!/^[A-Za-z0-9._@-]{1,64}$/.test(id)) fail('the admin ID can use letters, digits and . _ @ - (up to 64 characters)');
  if (password.length < 8) fail('the password must be at least 8 characters');
  return { id, line: `${id}:${sha512Crypt(password)}\n` };
}

// Uploads the staged files to /tmp on the server, runs the install script there, cleans up.
// Returns the script's exit status.
function runOnServer(config, workDir, files, scriptArgs) {
  const target = `${config.user}@${config.host}`;
  const remote = Object.fromEntries(Object.entries(files).map(([key, name]) => [key, `/tmp/${name}`]));

  step(`Uploading to ${config.host}`);
  const uploads = Object.values(files);
  if (run('scp', [...scpArgs(config), ...uploads, `${target}:/tmp/`], { cwd: workDir, remote: true }) !== 0) {
    fail(`upload to ${config.host} failed`);
  }

  step(`Installing on ${config.host}`);
  const env = {
    APP_NAME: config.appName,
    APP_DIR: config.appDir,
    WEB_ROOT: config.webRoot,
    NGINX_SNIPPET: config.snippet,
    NGINX_HTPASSWD: config.htpasswd,
    KIOSK_TOKEN_FILE: config.tokenFile,
    KEEP_RELEASES: config.keepReleases,
    USE_SUDO: config.useSudo
  };
  const command = [
    ...Object.entries(env).map(([key, value]) => `${key}=${shq(value)}`),
    'bash', shq(remote.script), ...scriptArgs(remote).map(shq)
  ].join(' ');
  const remoteCommand = `${command}; status=$?; rm -f ${Object.values(remote).map(shq).join(' ')}; exit $status`;

  // A terminal lets sudo ask for a password if the server needs one
  const tty = process.stdin.isTTY ? ['-t'] : [];
  return run('ssh', [...sshArgs(config), ...tty, target, remoteCommand], { remote: true });
}

// Without the kiosk cookie, the game and its files must redirect to the login page, the login
// page must load, and the login check must answer 403 (a 401 makes browsers pop up their own
// password box).
async function checkLiveSite(config) {
  if (!config.publicUrl) {
    console.log('\nTip: set DEPLOY_PUBLIC_URL in deploy/deploy.env to check the live game after each deploy.');
    return;
  }
  const base = config.publicUrl.replace(/\/?$/, '/');
  if (DRY_RUN) {
    console.log(`  [dry run] would check ${base}`);
    return;
  }

  step(`Checking ${base}`);
  const distPage = path.join(ROOT, 'dist', 'index.html');
  const script = fs.existsSync(distPage) ? fs.readFileSync(distPage, 'utf8').match(/<script[^>]+src="([^"]+)"/)?.[1] : null;
  const gated = [base, ...(script ? [new URL(script, base).href] : [])];
  try {
    for (const url of gated) {
      const res = await fetch(url, { redirect: 'manual', cache: 'no-store' });
      const location = res.headers.get('location');
      if (res.status !== 302 || !location || !new URL(location, url).pathname.endsWith(`${config.basePath}/login/`)) {
        fail(`${url} answered ${res.status} to a device that isn't logged in; it should redirect to ${config.basePath}/login/. Is the include line in the right server block?`);
      }
    }
    const login = await fetch(new URL('login/', base), { cache: 'no-store' });
    if (!login.ok || !(await login.text()).includes('login-form')) fail(`the kiosk login page ${base}login/ answered ${login.status}`);
    console.log('  ✓ the game asks devices to log in, and the login page loads');

    const check = await fetch(new URL('__login', base), { cache: 'no-store' });
    if (check.status !== 403) {
      console.log(`  ⚠ ${base}__login answered ${check.status} without a password (expected 403); browsers may show their own login box`);
    }
  } catch (error) {
    fail(`could not reach ${base}: ${error.message}`);
  }
}

async function main() {
  const config = readConfig();
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), `${config.appName}-deploy-`));
  const tag = `${config.appName}-${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}`;

  const action = ROLLBACK ? 'Rolling back' : SET_ADMIN ? 'Setting the kiosk admin login for' : 'Deploying';
  console.log(`${action} ${config.basePath}/ on ${config.user}@${config.host}${DRY_RUN ? ' (dry run)' : ''}`);

  let status;
  let admin;
  if (ROLLBACK) {
    status = runOnServer(config, workDir, { script: stageScript(workDir, tag) }, () => ['rollback']);
  } else if (SET_ADMIN) {
    admin = await readAdminLogin();
    const files = { script: stageScript(workDir, tag), admin: `${tag}-admin.htpasswd` };
    fs.writeFileSync(path.join(workDir, files.admin), admin.line, { mode: 0o600 });
    status = runOnServer(config, workDir, files, (remote) => ['set-admin', remote.admin]);
  } else {
    build(config);
    const files = stage(config, workDir, tag);
    status = runOnServer(config, workDir, files, (remote) => ['install', remote.archive, remote.snippet]);
  }

  if (DRY_RUN) {
    console.log(`\nDry run: nothing was uploaded. Prepared files are in ${workDir}`);
  } else {
    fs.rmSync(workDir, { recursive: true, force: true });
  }

  if (status === 2) {
    console.log('\n⚠ The game is uploaded, but a one-time step shown above is still needed.');
    process.exit(2);
  }
  if (status !== 0) fail(`the server-side step failed (exit ${status}); the live game was not changed`);

  if (SET_ADMIN) {
    console.log(DRY_RUN ? '\n✔ Dry run complete' : `\n✔ Kiosk admin login set for ID "${admin.id}"`);
    return;
  }
  await checkLiveSite(config);
  if (DRY_RUN) {
    console.log('\n✔ Dry run complete');
  } else {
    console.log(`\n✔ ${ROLLBACK ? 'Rolled back' : 'Deployed'} ${config.basePath}/`);
  }
}

main();
