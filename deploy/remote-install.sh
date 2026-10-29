#!/usr/bin/env bash
# Runs on the server; uploaded and started by deploy/deploy.mjs.
#
#   remote-install.sh install <build.tgz> <nginx-snippet.conf>
#       Unpacks the build as a new release, installs the nginx snippet, checks nginx,
#       then switches the live symlink and reloads nginx.
#   remote-install.sh rollback
#       Points the live symlink back at the previous release.
#   remote-install.sh set-admin <admin.htpasswd>
#       Installs the kiosk admin login: one "ID:password-hash" line, hashed by deploy.mjs so
#       the password itself never reaches the server.
#
# Settings come from the environment (deploy.mjs passes them from deploy/deploy.env):
#   APP_NAME          URL segment and live-symlink name     (document_dash)
#   APP_DIR           where releases are kept                (/opt/document_dash)
#   WEB_ROOT          nginx root holding the live symlink    (/var/www/apps)
#   NGINX_SNIPPET     where the nginx snippet is installed   (/etc/nginx/snippets/document_dash.conf)
#   NGINX_HTPASSWD    the kiosk admin login file             (/etc/nginx/document_dash.htpasswd)
#   KIOSK_TOKEN_FILE  the kiosk cookie's secret value        (/etc/nginx/document_dash.kiosk-token)
#   KEEP_RELEASES     how many releases to keep              (5)
#   USE_SUDO          run privileged steps with sudo         (true)
#
# Exit codes: 0 done, 1 failed (nothing changed live), 2 deployed but a one-time step is
# still needed (printed below).
set -euo pipefail

APP_NAME="${APP_NAME:-document_dash}"
APP_DIR="${APP_DIR:-/opt/$APP_NAME}"
WEB_ROOT="${WEB_ROOT:-/var/www/apps}"
NGINX_SNIPPET="${NGINX_SNIPPET:-/etc/nginx/snippets/$APP_NAME.conf}"
NGINX_HTPASSWD="${NGINX_HTPASSWD:-/etc/nginx/$APP_NAME.htpasswd}"
KIOSK_TOKEN_FILE="${KIOSK_TOKEN_FILE:-/etc/nginx/$APP_NAME.kiosk-token}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
SUDO=""
if [ "${USE_SUDO:-true}" = "true" ] && [ "$(id -u)" -ne 0 ]; then SUDO="sudo"; fi

RELEASES="$APP_DIR/releases"
LIVE_LINK="$WEB_ROOT/$APP_NAME"

# Private scratch space for this run. It holds copies of the kiosk token, so it is always removed.
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

log() { printf '\n==> %s\n' "$*"; }
fail() { printf '\nERROR: %s\n' "$*" >&2; exit 1; }

# Releases are named by timestamp, so name order is deploy order
list_releases() {
  if [ -d "$RELEASES" ]; then find "$RELEASES" -mindepth 1 -maxdepth 1 -type d | sort; fi
}

# Points the live symlink at a release with one atomic rename, so visitors never see a
# half-switched site
switch_to() {
  $SUDO ln -sfn "$1" "$LIVE_LINK.next"
  $SUDO mv -Tf "$LIVE_LINK.next" "$LIVE_LINK"
}

reload_nginx() {
  $SUDO nginx -t || return 1
  if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet nginx 2>/dev/null; then
    $SUDO systemctl reload nginx
  else
    $SUDO nginx -s reload
  fi
}

snippet_is_included() {
  $SUDO nginx -T 2>/dev/null | grep -qF "# configuration file $NGINX_SNIPPET:"
}

print_include_instructions() {
  printf '\nACTION NEEDED (one time): nginx is not loading %s yet.\n' "$NGINX_SNIPPET"
  printf 'Add this line inside your site'\''s server { } block, then run the deploy again:\n\n'
  printf '    include %s;\n\n' "$NGINX_SNIPPET"
}

print_admin_instructions() {
  printf '\nACTION NEEDED (one time): no kiosk admin login is set yet, so no kiosk can open the game.\n'
  printf 'Set the admin ID and password from your computer with:\n\n'
  printf '    npm run deploy:admin\n\n'
}

# The kiosk cookie's value: random, made on the first deploy and kept only on the server (the
# repo and the uploaded snippet hold a placeholder). Delete the file and deploy again to log
# out every kiosk.
load_kiosk_token() {
  if ! $SUDO test -s "$KIOSK_TOKEN_FILE"; then
    log "Creating the kiosk login token at $KIOSK_TOKEN_FILE"
    $SUDO mkdir -p "$(dirname "$KIOSK_TOKEN_FILE")"
    od -An -tx1 -N32 /dev/urandom | tr -d ' \n' \
      | $SUDO sh -c 'umask 077 && cat > "$1" && chmod 600 "$1"' sh "$KIOSK_TOKEN_FILE"
  fi
  KIOSK_TOKEN="$($SUDO cat "$KIOSK_TOKEN_FILE")"
  [[ "$KIOSK_TOKEN" =~ ^[0-9a-f]{32,128}$ ]] || fail "$KIOSK_TOKEN_FILE doesn't hold a valid token; delete it and deploy again"
}

install_release() {
  local archive="$1" snippet="$2"
  [ -f "$archive" ] || fail "build archive not found: $archive"
  [ -f "$snippet" ] || fail "nginx snippet not found: $snippet"
  command -v nginx >/dev/null 2>&1 || fail "nginx is not installed on this server"

  load_kiosk_token
  local rendered="$WORK/snippet.conf"
  sed "s/__KIOSK_TOKEN__/$KIOSK_TOKEN/g" "$snippet" > "$rendered"
  if grep -q '__[A-Z][A-Z_]*__' "$rendered"; then fail "the nginx snippet has unfilled placeholders"; fi

  local release
  release="$RELEASES/$(date +%Y%m%d-%H%M%S)"
  # Two deploys in the same second get distinct, still correctly ordered names
  local suffix=1 base="$release"
  while [ -e "$release" ]; do release="$base-$suffix"; suffix=$((suffix + 1)); done
  log "Unpacking the build into $release"
  $SUDO mkdir -p "$release" "$WEB_ROOT" "$(dirname "$NGINX_SNIPPET")"
  $SUDO tar -xzf "$archive" -C "$release" --no-same-owner
  if [ ! -f "$release/index.html" ]; then
    $SUDO rm -rf "$release"
    fail "the build archive has no index.html"
  fi
  $SUDO chmod -R a+rX "$release"

  log "Installing the nginx snippet at $NGINX_SNIPPET"
  local backup=""
  if [ -f "$NGINX_SNIPPET" ]; then
    backup="$WORK/snippet.backup"
    $SUDO cp "$NGINX_SNIPPET" "$backup"
  fi
  # Readable by root only, since it holds the kiosk token (nginx reads its configuration as root)
  $SUDO install -m 600 "$rendered" "$NGINX_SNIPPET"
  if ! $SUDO nginx -t; then
    if [ -n "$backup" ]; then $SUDO cp "$backup" "$NGINX_SNIPPET"; else $SUDO rm -f "$NGINX_SNIPPET"; fi
    $SUDO rm -rf "$release"
    fail "nginx rejected the configuration; the previous snippet was restored and nothing went live"
  fi

  local previous=""
  if [ -L "$LIVE_LINK" ]; then previous="$(readlink "$LIVE_LINK")"; fi

  log "Switching $LIVE_LINK to the new release"
  switch_to "$release"
  if ! reload_nginx; then
    if [ -n "$previous" ]; then switch_to "$previous"; fi
    fail "nginx reload failed; switched back to the previous release"
  fi

  log "Keeping the newest $KEEP_RELEASES releases"
  list_releases | head -n -"$KEEP_RELEASES" | while read -r old; do
    [ "$old" = "$release" ] || $SUDO rm -rf "$old"
  done

  local pending=0
  if ! snippet_is_included; then print_include_instructions; pending=1; fi
  if ! $SUDO test -s "$NGINX_HTPASSWD"; then print_admin_instructions; pending=1; fi
  [ "$pending" -eq 0 ] || exit 2
  log "Live: $(basename "$release")"
}

rollback_release() {
  [ -L "$LIVE_LINK" ] || fail "nothing has been deployed yet"
  local current previous
  # The link holds a path exactly as list_releases prints it (see switch_to)
  current="$(readlink "$LIVE_LINK")"
  previous="$(list_releases | grep -B1 -xF "$current" | head -n 1)"
  if [ -z "$previous" ] || [ "$previous" = "$current" ]; then fail "there is no earlier release to roll back to"; fi

  log "Rolling back from $(basename "$current") to $(basename "$previous")"
  switch_to "$previous"
  reload_nginx || fail "nginx reload failed"
  log "Live: $(basename "$previous")"
}

# The group nginx's worker processes run as, from its `user` directive; empty if not set
nginx_worker_group() {
  local user="" group=""
  read -r user group <<< "$($SUDO nginx -T 2>/dev/null | awk '$1 == "user" { gsub(";", ""); print $2, $3; exit }' || true)"
  if [ -n "$user" ] && [ -z "$group" ]; then group="$(id -gn "$user" 2>/dev/null || true)"; fi
  printf '%s' "$group"
}

set_admin() {
  local file="$1"
  [ -f "$file" ] || fail "admin login file not found: $file"
  if [ "$(wc -l < "$file")" -ne 1 ] \
    || ! grep -qE '^[A-Za-z0-9._@-]{1,64}:\$6\$[./0-9A-Za-z]{1,16}\$[./0-9A-Za-z]{86}$' "$file"; then
    fail "the admin login file must hold one ID:password-hash line"
  fi
  command -v nginx >/dev/null 2>&1 || fail "nginx is not installed on this server"

  log "Setting the kiosk admin login in $NGINX_HTPASSWD"
  $SUDO mkdir -p "$(dirname "$NGINX_HTPASSWD")"
  # nginx's workers read the file on each login (no reload needed); keep it from other users
  local group
  group="$(nginx_worker_group)"
  if [ -n "$group" ]; then
    $SUDO install -m 640 -g "$group" "$file" "$NGINX_HTPASSWD"
  else
    $SUDO install -m 644 "$file" "$NGINX_HTPASSWD"
  fi
  log "Admin ID '$(cut -d: -f1 "$file")' can now log kiosks in. Kiosks already logged in stay logged in."
}

case "${1:-}" in
  install)   [ $# -eq 3 ] || fail "usage: $0 install <build.tgz> <nginx-snippet.conf>"; install_release "$2" "$3" ;;
  rollback)  rollback_release ;;
  set-admin) [ $# -eq 2 ] || fail "usage: $0 set-admin <admin.htpasswd>"; set_admin "$2" ;;
  *)         fail "usage: $0 install <build.tgz> <nginx-snippet.conf> | rollback | set-admin <admin.htpasswd>" ;;
esac
