import React from 'react';

export default function GameHUD({
  participantName,
  timeLeft,
  unlockedCount,
  totalCertificates,
  lang,
  theme = 'dark',
  onToggleTheme,
  onToggleLang,
  isAudioMuted,
  onToggleAudio,
  onOpenHelp,
  onEndGameEarly
}) {
  const isEn = lang === 'en';
  const isUrgent = timeLeft <= 10;

  // Format seconds to MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return (
    <header className="top-hud">
      {/* Brand Section */}
      <div className="brand-section">
        <div className="cg-emblem-badge" title="Government of Chhattisgarh / छत्तीसगढ़ शासन">
          <svg viewBox="0 0 100 100" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" stroke="#ffffff" strokeWidth="2.5" opacity="0.6"/>
            <circle cx="50" cy="50" r="41" stroke="#ffaa00" strokeWidth="2" strokeDasharray="4 2"/>
            <path d="M50 14 L55 24 L66 20 L68 31 L79 32 L76 43 L85 49 L79 56 L85 64 L75 68 L76 79 L65 78 L61 88 L50 83 L39 88 L35 78 L24 79 L25 68 L15 64 L21 56 L15 49 L24 43 L21 32 L32 31 L34 20 L45 24 Z" fill="rgba(255, 170, 0, 0.25)" stroke="#00d2ff" strokeWidth="1.8"/>
            <circle cx="50" cy="50" r="16" fill="#0077ff" stroke="#ffffff" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className="brand-titles">
          <h1 className="brand-main">SEVA SETU • DOCUMENT DASH</h1>
          <span className="brand-sub">CHiPS • Government of Chhattisgarh</span>
        </div>
      </div>

      {/* Center 45-Second Timer Pill */}
      <div className={`countdown-timer-pill ${isUrgent ? 'timer-urgent' : ''}`}>
        <span className="timer-icon">⏱️</span>
        <span className="timer-digits">{timeFormatted}</span>
      </div>

      {/* Participant & Unlocked Status */}
      <div className="hud-stats-group">
        {/* Participant Name Badge */}
        <div className="participant-hud-badge" title="Active Citizen Participant">
          <span>👤</span>
          <span className="participant-hud-name">{participantName}</span>
        </div>

        {/* Certificates Unlocked Count */}
        <div className="target-cert-pill">
          <span className="cert-icon">📜</span>
          <span className="cert-name">
            {unlockedCount} / {totalCertificates}
          </span>
          <span className="level-badge" style={{ background: unlockedCount === 4 ? '#00e676' : undefined }}>
            {unlockedCount === 4 ? (isEn ? 'MASTER' : 'मास्टर') : (isEn ? 'UNLOCKED' : 'अनलॉक')}
          </span>
        </div>

        {/* Action Controls */}
        <div className="controls-group">

          <button
            onClick={onToggleLang}
            className="icon-btn lang-btn"
            title={isEn ? 'Switch to Hindi' : 'Switch to English'}
          >
            {isEn ? '🇮🇳' : '🇬🇧'}
          </button>

          <button
            onClick={onToggleAudio}
            className="icon-btn"
            title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isAudioMuted ? '🔇' : '🔊'}
          </button>

          <button
            onClick={onOpenHelp}
            className="icon-btn"
            title="Rules & Guide"
          >
            ℹ️
          </button>

          <button
            onClick={onEndGameEarly}
            className="icon-btn"
            title={isEn ? 'Finish Challenge & View Score Card' : 'स्कोर कार्ड देखें'}
          >
            🏁
          </button>
        </div>
      </div>
    </header>
  );
}
