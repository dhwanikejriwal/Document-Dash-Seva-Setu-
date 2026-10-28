import React, { useState } from 'react';
import {
  MonitorPlay, Languages, Volume2, VolumeX, Landmark, Zap, Bot, Dices, Flag, Rocket, ArrowRight,
  User, BriefcaseBusiness, GraduationCap, Sprout, FlaskConical
} from 'lucide-react';
import { sound } from '../audio';
import { CERTIFICATES, mandatoryRequirements } from '../data/certificates';
import Icon from './Icon';
import './WelcomeScreen.css';

export default function WelcomeScreen({
  lang = 'en',
  onStartGame,
  onToggleLang,
  isAudioMuted,
  onToggleAudio,
  onTriggerScreensaver
}) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('citizen');
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState(null); // null | 3 | 2 | 1 | 'DASH!'
  const isEn = lang === 'en';

  const avatarOptions = [
    { id: 'citizen', icon: User, label_en: 'Citizen', label_hi: 'नागरिक' },
    { id: 'officer', icon: BriefcaseBusiness, label_en: 'Officer', label_hi: 'अधिकारी' },
    { id: 'student', icon: GraduationCap, label_en: 'Student', label_hi: 'छात्र' },
    { id: 'farmer', icon: Sprout, label_en: 'Farmer', label_hi: 'किसान' },
    { id: 'specialist', icon: FlaskConical, label_en: 'Specialist', label_hi: 'विशेषज्ञ' }
  ];

  const quickTags = [
    'Aarav_Raipur',
    'Priya_Bhilai',
    'Kavya_CG',
    'Rohan_Speed',
    'Vikram_Bilaspur'
  ];

  const handleInputChange = (e) => {
    setName(e.target.value);
    sound.playKeyBlip();
  };

  const handleRandomTag = () => {
    sound.playPickup();
    const randomTag = quickTags[Math.floor(Math.random() * quickTags.length)];
    setName(randomTag);
  };

  const handleSelectQuickTag = (tag) => {
    sound.playPickup();
    setName(tag);
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
      setLaunchCountdown(isEn ? 'DASH!' : 'शुरू!');
    }, 1140);

    setTimeout(() => {
      onStartGame(finalName);
    }, 1500);
  };

  const currentAvatarObj = avatarOptions.find(a => a.id === selectedAvatar) || avatarOptions[0];

  return (
    <div className={`welcome-stage-arena ${isLaunching ? 'stage-warp-exit' : 'stage-enter-animated'}`}>
      {/* Launch Hologram Countdown Overlay (3... 2... 1... DASH!) */}
      {isLaunching && (
        <div className="launch-countdown-overlay">
          <div className="countdown-ring-pulse" />
          <div className="countdown-number-display">
            {launchCountdown}
            {typeof launchCountdown === 'string' && <> <Icon as={Rocket} /></>}
          </div>
          <div className="countdown-sub-hint">
            {isEn ? 'GET READY TO SORT!' : 'दस्तावेज़ छांटने के लिए तैयार हो जाएं!'}
          </div>
        </div>
      )}

      {/* Top Global Nav Header */}
      <header className="welcome-nav-bar">
        <div className="welcome-nav-brand">
          <div className="cg-emblem-badge" title="Government of Chhattisgarh">
            <svg viewBox="0 0 100 100" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="46" stroke="#ff6d00" strokeWidth="3" opacity="0.8"/>
              <circle cx="50" cy="50" r="41" stroke="#00c853" strokeWidth="2.5" strokeDasharray="4 2"/>
              <path d="M50 14 L55 24 L66 20 L68 31 L79 32 L76 43 L85 49 L79 56 L85 64 L75 68 L76 79 L65 78 L61 88 L50 83 L39 88 L35 78 L24 79 L25 68 L15 64 L21 56 L15 49 L24 43 L21 32 L32 31 L34 20 L45 24 Z" fill="rgba(255, 109, 0, 0.2)" stroke="#0084ff" strokeWidth="2"/>
              <circle cx="50" cy="50" r="16" fill="#0084ff" stroke="#ffffff" strokeWidth="2"/>
            </svg>
          </div>
          <div className="nav-brand-text">
            <h3 className="nav-main-title">CHiPS • Government of Chhattisgarh</h3>
            <span className="nav-sub-title">
              {isEn ? 'Directorate of IT & Citizen e-Governance Services' : 'इलेक्ट्रॉनिक्स एवं सूचना प्रौद्योगिकी विभाग'}
            </span>
          </div>
        </div>

        <div className="welcome-nav-controls">
          <button
            type="button"
            onClick={onTriggerScreensaver}
            className="icon-btn screensaver-nav-btn"
            title={isEn ? 'Attract Screensaver Mode' : 'स्क्रीनसेवर मोड'}
          >
            <Icon as={MonitorPlay} />
          </button>
          <button
            type="button"
            onClick={onToggleLang}
            className="icon-btn lang-btn"
            title={isEn ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
          >
            <Icon as={Languages} /> {isEn ? 'HI' : 'EN'}
          </button>
          <button
            type="button"
            onClick={onToggleAudio}
            className="icon-btn"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            <Icon as={isAudioMuted ? VolumeX : Volume2} />
          </button>
        </div>
      </header>

      {/* Main Hero Arena Content */}
      <main className="welcome-hero-arena">
        {/* Top Mission Pill */}
        <div className="lets-start-animated-banner">
          <span className="banner-word word-flame"><Icon as={Landmark} /></span>
          <span className="banner-word word-greet">
            {isEn ? "OFFICIAL SEVA SETU MISSION" : "आधिकारिक सेवा सेतु नागरिक मिशन"}
          </span>
          <span className="banner-dot">•</span>
          <span className="banner-word word-race">
            {isEn ? "45s RAPID DASH" : "४५ सेकंड रैपिड रेस"}
          </span>
          <span className="banner-word word-flag"><Icon as={Zap} /></span>
        </div>

        {/* Central Brand Title */}
        <div className="welcome-title-cluster">
          <div className="mascot-grand-avatar">
            <span className="mascot-robot-face"><Icon as={Bot} /></span>
            <div className="mascot-halo-ring" />
          </div>

          <h1 className="welcome-grand-title kinetic-title-group" aria-label="Seva Setu Document Dash">
            <span className="kinetic-word word-1" style={{ '--word-delay': '0.05s' }}>SEVA</span>
            <span className="kinetic-word word-2" style={{ '--word-delay': '0.15s' }}>SETU</span>
            <span className="kinetic-separator" style={{ '--word-delay': '0.25s' }}>•</span>
            <span className="kinetic-word word-3" style={{ '--word-delay': '0.35s' }}>DOCUMENT</span>
            <span className="kinetic-word word-4" style={{ '--word-delay': '0.45s' }}>DASH</span>
          </h1>

          <p className="welcome-hero-subtitle">
            {isEn
              ? 'Master Chhattisgarh statutory certificates, sort official records & beat the 45-second race!'
              : 'छत्तीसगढ़ के अनिवार्य प्रमाण पत्र पहचानें, सही दस्तावेज़ मिलाएं और ४५ सेकंड की घड़ी को मात दें!'}
          </p>
        </div>

        {/* 4 Interactive Certificate Quest Badges Preview */}
        <div className="welcome-quests-showcase">
          {CERTIFICATES.map(c => (
            <div
              key={c.id}
              className="welcome-quest-badge"
              style={{ '--quest-color': c.color }}
            >
              <span className="quest-badge-icon"><Icon as={c.icon} /></span>
              <div className="quest-badge-info">
                <strong className="quest-badge-name">{isEn ? c.name_en : c.name_hi}</strong>
                <span className="quest-badge-docs">
                  {mandatoryRequirements(c).length} {isEn ? 'Proofs Needed' : 'दस्तावेज़ आवश्यक'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Main Citizen Access Terminal Card */}
        <div className="cyber-terminal-card">
          {/* Futuristic Corner Brackets */}
          <div className="hud-corner corner-tl" />
          <div className="hud-corner corner-tr" />
          <div className="hud-corner corner-bl" />
          <div className="hud-corner corner-br" />

          {/* Terminal Header Bar */}
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
              <Icon as={Dices} />
              <span>{isEn ? 'RANDOM CALLSIGN' : 'यादृच्छिक नाम'}</span>
            </button>
          </div>

          <form onSubmit={handleLaunch} className="terminal-form">
            {/* Input Row with Avatar Pod */}
            <div className="cyber-input-enclosure">
              {/* Animated Avatar Pod */}
              <div className="holo-avatar-pod" title="Player Avatar">
                <span className="holo-avatar-face"><Icon as={currentAvatarObj.icon} /></span>
                <span className="holo-pod-role-badge">
                  {isEn ? currentAvatarObj.label_en : currentAvatarObj.label_hi}
                </span>
                <div className="holo-pod-ring" />
              </div>

              {/* Input Core Bar */}
              <div className="cyber-input-core">
                <div className="cyber-tag-prefix">
                  <span>PILOT</span>
                  <span className="prefix-arrow">❯_</span>
                </div>

                <input
                  id="participant-name-input"
                  type="text"
                  className="cyber-text-field"
                  placeholder={isEn ? 'Enter Your Name / Callsign...' : 'अपना नाम या कॉलसाइन दर्ज करें...'}
                  value={name}
                  onChange={handleInputChange}
                  autoFocus
                  maxLength={24}
                  autoComplete="off"
                />

                <span className="cyber-input-sparkle"><Icon as={Zap} /></span>
                <div className="cyber-laser-scanline" />
              </div>
            </div>

            {/* Quick Callsign Tags Bar */}
            <div className="quick-tags-container">
              <span className="quick-tags-label">
                {isEn ? 'QUICK SELECT:' : 'त्वरित चयन:'}
              </span>
              <div className="quick-tags-row">
                {quickTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`quick-tag-pill ${name === tag ? 'tag-selected' : ''}`}
                    onClick={() => handleSelectQuickTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Role Selection Row */}
            <div className="terminal-options-row">
              <span className="options-row-label">
                {isEn ? 'SELECT AVATAR ROLE:' : 'अवतार भूमिका चुनें:'}
              </span>
              <div className="avatar-chip-row">
                {avatarOptions.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    className={`avatar-chip-btn ${selectedAvatar === av.id ? 'avatar-active' : ''}`}
                    onClick={() => {
                      sound.playPickup();
                      setSelectedAvatar(av.id);
                    }}
                    title={isEn ? av.label_en : av.label_hi}
                  >
                    <span className="avatar-emoji-span"><Icon as={av.icon} /></span>
                    <span className="avatar-title-sub">{isEn ? av.label_en : av.label_hi}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* High-Energy Glowing Launch CTA */}
            <button
              type="submit"
              className="terminal-start-cta"
              disabled={isLaunching}
            >
              <span className="cta-conic-glow" />
              <span className="cta-content-row">
                <span className="cta-flag-icon"><Icon as={Flag} /></span>
                <span className="cta-main-text">
                  {isEn ? "START 45s CITIZEN RACE!" : "४५ सेकंड नागरिक रेस शुरू करें!"}
                </span>
                <span className="cta-lightning-bolt"><Icon as={Rocket} /></span>
              </span>
            </button>
          </form>
        </div>

        {/* 3-Step "How to Play" Guide Bar */}
        <div className="welcome-guide-steps">
          <div className="guide-step-card">
            <span className="step-num-bubble">1</span>
            <div className="step-content">
              <strong>{isEn ? 'Spot Statutory Proofs' : 'दस्तावेज़ पहचानें'}</strong>
              <p>{isEn ? 'Click or drag official records from top shelf' : 'ऊपर शेल्फ से सरकारी प्रमाण पत्र चुनें'}</p>
            </div>
          </div>
          <div className="guide-step-arrow"><Icon as={ArrowRight} /></div>
          <div className="guide-step-card">
            <span className="step-num-bubble">2</span>
            <div className="step-content">
              <strong>{isEn ? 'Drop in Certificate Basket' : 'सही बास्केट में डालें'}</strong>
              <p>{isEn ? 'Deposit into Domicile, Caste, Income or Marriage' : 'निवास, जाति, आय या विवाह में जमा करें'}</p>
            </div>
          </div>
          <div className="guide-step-arrow"><Icon as={ArrowRight} /></div>
          <div className="guide-step-card">
            <span className="step-num-bubble">3</span>
            <div className="step-content">
              <strong>{isEn ? 'Unlock & Inspect Copies' : 'प्रमाण पत्र अनलॉक करें'}</strong>
              <p>{isEn ? 'Beat the 45s clock & download verified records' : 'समय समाप्त होने से पहले सभी अनलॉक करें'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
