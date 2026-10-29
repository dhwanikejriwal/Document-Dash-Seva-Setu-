# 📄 Document Dash 🚀

> **An interactive, arcade-style learning game about the documents citizen certificates need.**  
> Learn which supporting documents go with the Domicile, Caste, Income and Marriage certificates!

---

## 🌟 Key Features

- **🎮 Fast-Paced 1-Minute Sorting Dash**: Race against the clock to sort official Chhattisgarh citizen documents into their respective certificate baskets.
- **📜 4 Official Statutory Certificates**:
  - 🏠 **Domicile Certificate (निवास प्रमाण पत्र)**
  - 🛡️ **Caste Certificate (जाति प्रमाण पत्र)**
  - 💰 **Income Certificate (आय प्रमाण पत्र)**
  - 💍 **Marriage Certificate (विवाह प्रमाण पत्र)**
- **📑 43 Official Chhattisgarh Supporting Documents**: Every document type and supporting document from the official prerequisite tables (Affidavit, Income Proof, OBC Proof, 15-Year Residence Proof, Educational Certificate, and all eight Marriage records). Any one supporting document satisfies its document type, and the documents scroll in a horizontal slider.
- **✨ 3D Dynamic Arena**: Built with Three.js featuring daytime volumetric lighting, geometric physics particles, and ambient visual cues.
- **🎨 Bright Light Theme & High-Legibility Typography**: Curated high-contrast palette (Electric Azure, Vivid Emerald, Saffron Amber, Rose Magenta) with prominent, easily readable typography.
- **🔊 Dynamic Audio Effects**: Synthesized web-audio sound effects for keypresses, drops, combos, countdowns, and trophy unlocks.
- **🇮🇳 Bilingual Support**: Instant seamless toggle between **English** and **Hindi (छत्तीसगढ़ी/हिंदी)**.
- **🏆 Practice Certificates & Scorecard**: Completed certificates appear on the final scorecard as practice certificates in the player's name, clearly marked as not official documents.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Audio**: Web Audio API (Native procedural sound synthesis)
- **Effects**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Vanilla CSS (CSS Grid, Glassmorphism, Kinetic CSS Animations)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dhwanikejriwal/Document-Dash-Seva-Setu-.git
   cd Document-Dash-Seva-Setu-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Production builds load their files from `/document_dash/` (set `BASE_PATH` to change it).

---

## 🚀 Deploying to the Server

The game is served at **`/document_dash/`** on the server's existing nginx site. The deploy
adds its own nginx snippet and never edits the existing configuration.

### One-time setup

1. The server needs Linux, nginx, and an SSH login with `sudo` rights (SSH keys recommended).
2. Copy `deploy/deploy.env.example` to `deploy/deploy.env` (it is git-ignored) and set at least
   `DEPLOY_HOST` and `DEPLOY_USER`. Set `DEPLOY_PUBLIC_URL` to have each deploy check the live game.
3. Optionally create `.env.production` with `VITE_LAUNCHER_URL` (see *Game Flow* above).
4. Run `npm run deploy`. The first time, it uploads and installs the game, then asks you to add
   one line inside your site's `server { }` block (the HTTPS one, if the site has both):
   ```nginx
   include /etc/nginx/snippets/document_dash.conf;
   ```
   Then run `npm run deploy` again: it tests the nginx configuration and reloads nginx.
5. Set the admin ID and password that log kiosks in (see *Kiosk login* below):
   ```bash
   npm run deploy:admin
   ```

### Deploying from the server itself

If the project is cloned on the server, deploy there directly, with no SSH:

1. Install Node.js 20.19+ (or 22.12+), then run `npm ci` in the project folder.
2. Copy `deploy/deploy.env.example` to `deploy/deploy.env` and set `DEPLOY_HOST=local`
   (`DEPLOY_USER` isn't needed).
3. Run the same `npm run deploy`, `deploy:admin` and `deploy:rollback` commands as a user with
   `sudo` rights. Don't run them with `sudo npm ...`; the script uses `sudo` itself where needed.

To update later: `git pull`, then `npm run deploy`.

If a step fails, `bash deploy/vm-report.sh` runs `npm run deploy` (or the command you add after
it), saves the output with versions, settings and nginx's test result to `logs/`, and after asking
pushes it to the `vm-logs` branch so it can be read elsewhere. This repository is public, so the
report has the kiosk token, password hashes and IP addresses removed. Look it over before you say yes.

### Deploy, roll back, preview

```bash
npm run deploy
```

```bash
npm run deploy:rollback
```

```bash
npm run deploy -- --dry-run
```

`deploy` builds the game, uploads it over SSH and installs it as a new release; `deploy:rollback`
switches back to the previous release; `--dry-run` builds and prepares everything and prints
the commands without connecting.

### What it does on the server

| Path | Contents |
|---|---|
| `/opt/document_dash/releases/<timestamp>/` | Each deployed build (the newest 5 are kept) |
| `/var/www/apps/document_dash` | Symlink to the live release, which nginx serves |
| `/etc/nginx/snippets/document_dash.conf` | The game's nginx locations, generated from `deploy/nginx/document_dash.conf.template` |
| `/etc/nginx/document_dash.htpasswd` | The kiosk admin ID and password hash, set by `npm run deploy:admin` |
| `/etc/nginx/document_dash.kiosk-token` | The kiosk login cookie's secret value, created on the first deploy |

A deploy runs `nginx -t` before anything goes live and restores the previous snippet if nginx
rejects it. The live release is switched in one atomic step, and if the nginx reload fails it
switches back. All paths are configurable in `deploy/deploy.env`.

### Kiosk login

The game only opens on kiosks that staff have logged in, so someone who copies the URL can't
play it on their own device. nginx enforces this: without the kiosk's login cookie, the game
page and all of its files redirect to a login page, which contains no game code. (`npm run dev`
and `npm run preview` have no login.)

- **Log a kiosk in:** open the game's URL on it and enter the admin ID and password on the
  *Kiosk login* page. The kiosk keeps the login for a year and opens the game directly from then
  on, including when the game selection screen sends players to it. On a kiosk without a
  keyboard, use the system's on-screen keyboard or plug in a USB keyboard for this one step.
- **Keep the login across restarts:** run the kiosk browser with a normal, persistent profile.
  Incognito or guest windows, or "clear cookies on exit", log the kiosk out every time.
- **Change the admin ID or password:** run `npm run deploy:admin` again. The password is hashed
  on your computer and only the hash is sent to the server. Kiosks already logged in stay logged in.
- **Log one kiosk out:** open `/document_dash/__logout` on it.
- **Log every kiosk out** (for example, a kiosk went missing): delete the token file on the server,
  then deploy, which creates a new token:
  ```bash
  sudo rm /etc/nginx/document_dash.kiosk-token
  ```
  ```bash
  npm run deploy
  ```
- **Plain http:// sites:** the login cookie is marked `Secure`, which browsers only keep on
  https://. If the game is served over http://, set `DEPLOY_COOKIE_SECURE=false` in
  `deploy/deploy.env` and deploy again.

When `DEPLOY_PUBLIC_URL` is set, each deploy checks that the game and its files redirect devices
that aren't logged in and that the login page loads.

---

## 🏆 Game Flow & Winner Certificates

1. The kiosk's game selection screen opens this game's URL.
2. The player enters their name (it is printed on the certificate) and plays a 1-minute round.
3. If they complete all 4 certificates, the game calls the Rajyotsav certificate API once with
   `username`, `gameName` and `timeTaken` (m:ss), and the score card shows the returned QR code
   for the player to scan with their phone. If the request fails, a **Try again** button appears.
   Rounds that aren't won don't call the API.
4. **Next participant** (or 60 s without a touch) returns the kiosk to the game selection screen.

Configure the deployment with Vite env vars (copy `.env.example` to `.env.production`, then build):

| Variable | Purpose | Default |
|---|---|---|
| `VITE_LAUNCHER_URL` | Game selection screen to return to between players. Empty: stay on this game's start screen. | *(empty)* |
| `VITE_GAME_NAME` | Game name sent to the certificate API and printed on the certificate | `Document Dash` |
| `VITE_CERTIFICATE_API_URL` | Certificate API endpoint | `https://cggeomap.cgstate.gov.in/rajyotsav/api/certificate` |

Every API call creates a new certificate on the server, so test against a stand-in endpoint
(set `VITE_CERTIFICATE_API_URL`) rather than the live service.

---

## 🖐️ Running on a Touch Kiosk

The game is built for an unattended touch-screen kiosk:

- **Name entry** uses an on-screen keyboard; the system keyboard never opens. The name is formatted for certificates as it is typed (capitalised words, max 24 characters).
- **Auto-reset**: the start screen stays up between players, and a half-typed name left for 45 s is cleared. After 60 s without a touch mid-round or on the score card, the participant's name and results are cleared and the kiosk returns to the start screen, or to the game selection screen when `VITE_LAUNCHER_URL` is set (a countdown warns for the last 20 s). An idle start screen also returns to the game selection screen after 60 s.
- **Touch hardening**: pinch/double-tap zoom, pull-to-refresh, long-press menus and text selection are disabled.
- **Printing** is off by default because the browser print dialog exposes the operating system. To print certificates, run the browser with silent printing (Chrome `--kiosk-printing`) and set `PRINT_ENABLED` to `true` in `src/components/CertificateModal.jsx`.

Run the production build full-screen in the browser's kiosk mode, for example:

```bash
chrome --kiosk --kiosk-printing http://localhost:4173
```
