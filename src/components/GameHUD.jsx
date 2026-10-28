import React from 'react';
import { Timer, User, Award, Languages, Volume2, VolumeX, CircleHelp, Flag, FileCheck2 } from 'lucide-react';
import Icon from './Icon';
import './GameHUD.css';

export default function GameHUD({
  participantName,
  timeLeft,
  unlockedCount,
  totalCertificates,
  lang,
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
        <div className="app-logo-badge" aria-hidden="true">
          <Icon as={FileCheck2} />
        </div>
        <div className="brand-titles">
          <h1 className="brand-main">DOCUMENT DASH</h1>
          <span className="brand-sub">{isEn ? 'Certificate document game' : 'प्रमाण पत्र दस्तावेज़ खेल'}</span>
        </div>
      </div>

      {/* Center Race Timer Pill */}
      <div className={`countdown-timer-pill ${isUrgent ? 'timer-urgent' : ''}`}>
        <span className="timer-icon"><Icon as={Timer} /></span>
        <span className="timer-digits">{timeFormatted}</span>
      </div>

      {/* Participant & Unlocked Status */}
      <div className="hud-stats-group">
        {/* Participant Name Badge */}
        <div className="participant-hud-badge" title="Active Citizen Participant">
          <Icon as={User} />
          <span className="participant-hud-name">{participantName}</span>
        </div>

        {/* Certificates Unlocked Count */}
        <div className="target-cert-pill">
          <span className="cert-icon"><Icon as={Award} /></span>
          <span className="cert-name">
            {unlockedCount} / {totalCertificates}
          </span>
          <span className="level-badge" style={{ background: unlockedCount === 4 ? 'var(--green-400)' : undefined }}>
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
            <Icon as={Languages} />
          </button>

          <button
            onClick={onToggleAudio}
            className="icon-btn"
            title={isAudioMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            <Icon as={isAudioMuted ? VolumeX : Volume2} />
          </button>

          <button
            onClick={onOpenHelp}
            className="icon-btn"
            title="Rules & Guide"
          >
            <Icon as={CircleHelp} />
          </button>

          <button
            onClick={onEndGameEarly}
            className="icon-btn"
            title={isEn ? 'Finish Challenge & View Score Card' : 'स्कोर कार्ड देखें'}
          >
            <Icon as={Flag} />
          </button>
        </div>
      </div>
    </header>
  );
}
