import React, { useState } from 'react';
import { sound } from '../audio';

export default function WelcomeScreen({
  lang = 'en',
  theme = 'dark',
  onToggleTheme,
  onStartGame,
  onToggleLang,
  isAudioMuted,
  onToggleAudio,
  onTriggerScreensaver
}) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👤');
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState(null); // null | 3 | 2 | 1 | 'DASH!'
  const isEn = lang === 'en';

  const avatars = ['👨‍💼', '👩‍💼', '🧑‍🎓', '👨‍🌾', '👩‍🔬'];
  const quickTags = ['Aarav_CG', 'Priya_Speed', 'Rohan_Dash', 'Kavya_Pro', 'Vikram_Ace'];

  const handleInputChange = (e) => {
    setName(e.target.value);
    sound.playKeyBlip();
  };

  const handleRandomTag = () => {
    sound.playPickup();
    const randomTag = quickTags[Math.floor(Math.random() * quickTags.length)];
    setName(randomTag);
  };

  const handleLaunch = (e) => {
    if (e) e.preventDefault();
    if (isLaunching) return;

    const finalName = name.trim() || (isEn ? 'Citizen Pilot' : 'नागरिक प्रतिभागी');
    setIsLaunching(true);
    sound.playCountdown(3);
    setLaunchCountdown(3);

    // Countdown sequence: 3 -> 2 -> 1 -> DASH!
    setTimeout(() => {
      sound.playCountdown(2);
      setLaunchCountdown(2);
    }, 380);

    setTimeout(() => {
      sound.playCountdown(1);
      setLaunchCountdown(1);
    }, 760);

    setTimeout(() => {
      sound.playLaunchWarp();
      setLaunchCountdown(isEn ? 'DASH! 🚀' : 'शुरू! 🚀');
    }, 1140);

    setTimeout(() => {
      onStartGame(finalName);
    }, 1500);
  };

  return (
    <div className={`welcome-stage-arena ${isLaunching ? 'stage-warp-exit' : 'stage-enter-animated'}`}>
      {/* Launch Hologram Countdown Overlay (3... 2... 1... DASH!) */}
      {isLaunching && (
        <div className="launch-countdown-overlay">
          <div className="countdown-ring-pulse" />
          <div className="countdown-number-display">
            {launchCountdown}
          </div>
        </div>
      )}

      {/* Top Global Nav */}
      <header className="welcome-nav-bar">
        <div className="welcome-nav-brand">
          <div className="cg-emblem-badge" title="Government of Chhattisgarh">
            <svg viewBox="0 0 100 100" width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="#ffffff" strokeWidth="2.5" opacity="0.6"/>
              <circle cx="50" cy="50" r="41" stroke="#ffaa00" strokeWidth="2" strokeDasharray="4 2"/>
              <path d="M50 14 L55 24 L66 20 L68 31 L79 32 L76 43 L85 49 L79 56 L85 64 L75 68 L76 79 L65 78 L61 88 L50 83 L39 88 L35 78 L24 79 L25 68 L15 64 L21 56 L15 49 L24 43 L21 32 L32 31 L34 20 L45 24 Z" fill="rgba(255, 170, 0, 0.25)" stroke="#00d2ff" strokeWidth="1.8"/>
              <circle cx="50" cy="50" r="16" fill="#0077ff" stroke="#ffffff" strokeWidth="1.5"/>
            </svg>
          </div>
          <div className="nav-brand-text">
            <h3 className="nav-main-title">CHiPS • Government of Chhattisgarh</h3>
          </div>
        </div>

        <div className="welcome-nav-controls">
          <button
            type="button"
            onClick={onTriggerScreensaver}
            className="icon-btn screensaver-nav-btn"
            title={isEn ? 'Attract Mode / Screensaver' : 'स्क्रीनसेवर'}
          >
            🌌
          </button>
          <button
            type="button"
            onClick={onToggleLang}
            className="icon-btn lang-btn"
            title={isEn ? 'हिंदी' : 'English'}
          >
            {isEn ? '🇮🇳' : '🇬🇧'}
          </button>
          <button
            type="button"
            onClick={onToggleAudio}
            className="icon-btn"
            title={isAudioMuted ? 'Unmute' : 'Mute'}
          >
            {isAudioMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {/* Main Full-Screen Welcome Hero Arena */}
      <main className="welcome-hero-arena">
        {/* Animated Callout Pill with Drop-in transition */}
        <div className="lets-start-animated-banner">
          <span className="banner-word word-flame">🔥</span>
          <span className="banner-word word-greet">
            {isEn ? "LET'S START!" : "चलिए शुरू करते हैं!"}
          </span>
          <span className="banner-dot">•</span>
          <span className="banner-word word-race">
            {isEn ? "45s RACE" : "४५ सेकंड रेस"}
          </span>
          <span className="banner-word word-flag">🏁</span>
        </div>

        {/* Central Brand Title & Animated Kinetic Words */}
        <div className="welcome-title-cluster">
          <div className="mascot-grand-avatar">
            <span className="mascot-robot-face">🤖</span>
            <div className="mascot-halo-ring" />
          </div>

          <h1 className="welcome-grand-title kinetic-title-group" aria-label="Seva Setu Document Dash">
            <span className="kinetic-word word-1" style={{ '--word-delay': '0.05s' }}>SEVA</span>
            <span className="kinetic-word word-2" style={{ '--word-delay': '0.15s' }}>SETU</span>
            <span className="kinetic-separator" style={{ '--word-delay': '0.25s' }}>•</span>
            <span className="kinetic-word word-3" style={{ '--word-delay': '0.35s' }}>DOCUMENT</span>
            <span className="kinetic-word word-4" style={{ '--word-delay': '0.45s' }}>DASH</span>
          </h1>
        </div>

        {/* High-Tech Cyber-Arcade Gamer ID Console */}
        <div className="cyber-terminal-card">
          {/* Futuristic HUD Corner Brackets */}
          <div className="hud-corner corner-tl" />
          <div className="hud-corner corner-tr" />
          <div className="hud-corner corner-bl" />
          <div className="hud-corner corner-br" />

          {/* Terminal Status Bar */}
          <div className="terminal-status-header">
            <div className="terminal-status-indicator">
              <span className="terminal-led-dot" />
              <span className="terminal-status-text">
                {isEn ? 'CITIZEN TERMINAL // ACCESS LEVEL 1' : 'नागरिक टर्मिनल // स्तर १'}
              </span>
            </div>

            <button
              type="button"
              className="terminal-dice-btn"
              onClick={handleRandomTag}
              title={isEn ? 'Generate random callsign' : 'यादृच्छिक नाम चुनें'}
            >
              <span>🎲</span>
              <span>{isEn ? 'RANDOM ID' : 'नया नाम'}</span>
            </button>
          </div>

          <form onSubmit={handleLaunch} className="terminal-form">
            {/* Cyber Input Field with Holo-Avatar Pod */}
            <div className="cyber-input-enclosure">
              {/* Animated Holo-Avatar Pod */}
              <div className="holo-avatar-pod" title="Player Avatar">
                <span className="holo-avatar-face">{selectedAvatar}</span>
                <div className="holo-pod-ring" />
              </div>

              {/* Input Core Bar */}
              <div className="cyber-input-core">
                <div className="cyber-tag-prefix">
                  <span>PLAYER</span>
                  <span className="prefix-arrow">❯_</span>
                </div>

                <input
                  id="participant-name-input"
                  type="text"
                  className="cyber-text-field"
                  placeholder={isEn ? 'Enter Callsign / Name...' : 'अपना नाम दर्ज करें...'}
                  value={name}
                  onChange={handleInputChange}
                  autoFocus
                  maxLength={24}
                  autoComplete="off"
                />

                <span className="cyber-input-sparkle">⚡</span>
                <div className="cyber-laser-scanline" />
              </div>
            </div>

            {/* Quick Avatar Selector Chips */}
            <div className="terminal-options-row">
              <span className="options-row-label">
                {isEn ? 'SELECT AVATAR:' : 'अवतार चुनें:'}
              </span>
              <div className="avatar-chip-row">
                {avatars.map(av => (
                  <button
                    key={av}
                    type="button"
                    className={`avatar-chip-btn ${selectedAvatar === av ? 'avatar-active' : ''}`}
                    onClick={() => {
                      sound.playPickup();
                      setSelectedAvatar(av);
                    }}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Supercharged Arcade Start CTA */}
            <button
              type="submit"
              className="terminal-start-cta"
              disabled={isLaunching}
            >
              <span className="cta-conic-glow" />
              <span className="cta-content-row">
                <span className="cta-flag-icon">🏁</span>
                <span className="cta-main-text">
                  {isEn ? "LET'S START THE 45 SECS RACE!" : "चलिए शुरू करते हैं ४५ सेकंड की रेस!"}
                </span>
                <span className="cta-lightning-bolt">⚡</span>
              </span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
