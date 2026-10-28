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

---

## 🖐️ Running on a Touch Kiosk

The game is built for an unattended touch-screen kiosk:

- **Name entry** uses an on-screen keyboard; the system keyboard never opens. The name is formatted for certificates as it is typed (capitalised words, max 24 characters).
- **Auto-reset**: the start screen stays up between players, and a half-typed name left for 45 s is cleared. After 60 s without a touch mid-round or on the score card, the participant's name and results are cleared and the kiosk returns to the start screen (a countdown warns for the last 20 s).
- **Touch hardening**: pinch/double-tap zoom, pull-to-refresh, long-press menus and text selection are disabled.
- **Printing** is off by default because the browser print dialog exposes the operating system. To print certificates, run the browser with silent printing (Chrome `--kiosk-printing`) and set `PRINT_ENABLED` to `true` in `src/components/CertificateModal.jsx`.

Run the production build full-screen in the browser's kiosk mode, for example:

```bash
chrome --kiosk --kiosk-printing http://localhost:4173
```
