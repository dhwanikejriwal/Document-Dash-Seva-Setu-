import React, { useState, useCallback, useEffect } from 'react';
import {
  Languages, Volume2, VolumeX, Flag, Rocket, Award, GalleryHorizontal, Hand, ListChecks, Timer, FileCheck2,
  LayoutGrid
} from 'lucide-react';
import { sound } from '../audio';
import { LAUNCHER_URL } from '../config';
import Icon from './Icon';
import NameKeyboard, { NAME_MAX_LENGTH, typeIntoName, isNameValid } from './NameKeyboard';
import './WelcomeScreen.css';

// Kiosk: a name left half-typed by someone who walked away is cleared after this long
const ABANDONED_NAME_MS = 45000;

const HOW_TO_PLAY = [
  {
    icon: GalleryHorizontal,
    title_en: 'Browse the documents',
    title_hi: 'दस्तावेज़ देखें',
    text_en: 'Swipe the shelf at the top to see every document.',
    text_hi: 'ऊपर की शेल्फ़ को स्वाइप करके सभी दस्तावेज़ देखें।'
  },
  {
    icon: Hand,
    title_en: 'Drop it in the right certificate',
    title_hi: 'सही प्रमाण पत्र में डालें',
    text_en: 'Drag a document onto a certificate, or tap the document and then the certificate.',
    text_hi: 'दस्तावेज़ को प्रमाण पत्र पर खींचें, या पहले दस्तावेज़ और फिर प्रमाण पत्र पर टैप करें।'
  },
  {
    icon: ListChecks,
    title_en: 'One document per type',
    title_hi: 'हर प्रकार का एक दस्तावेज़',
    text_en: 'Any one document of each required type is enough. Tap a certificate to see what it needs.',
    text_hi: 'हर आवश्यक प्रकार का कोई एक दस्तावेज़ पर्याप्त है। ज़रूरी दस्तावेज़ देखने के लिए प्रमाण पत्र पर टैप करें।'
  },
  {
    icon: Timer,
    title_en: 'Beat the 1-minute clock',
    title_hi: '१ मिनट की घड़ी को मात दें',
    text_en: 'Complete all 4 certificates. They are issued in your name at the end.',
    text_hi: 'चारों प्रमाण पत्र पूरे करें। अंत में ये आपके नाम से जारी होंगे।'
  }
];

export default function WelcomeScreen({
  lang = 'en',
  onStartGame,
  onToggleLang,
  isAudioMuted,
  onToggleAudio
}) {
  const [name, setName] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState(null); // null | 3 | 2 | 1 | 'DASH!'
  const isEn = lang === 'en';
  const canStart = isNameValid(name);

  // Every keystroke changes the name and restarts this timer
  useEffect(() => {
    if (!name || isLaunching) return;
    const timer = setTimeout(() => setName(''), ABANDONED_NAME_MS);
    return () => clearTimeout(timer);
  }, [name, isLaunching]);

  const handleKey = useCallback((key) => {
    sound.playKeyBlip();
    setName(current => typeIntoName(current, key));
  }, []);

  const handleLaunch = useCallback(() => {
    if (!canStart || isLaunching) return;

    const finalName = name.trim();
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
  }, [canStart, isLaunching, name, isEn, onStartGame]);

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
          <div className="app-logo-badge" aria-hidden="true">
            <Icon as={FileCheck2} />
          </div>
          <div className="nav-brand-text">
            <h3 className="nav-main-title">Document Dash</h3>
            <span className="nav-sub-title">
              {isEn ? 'Learn the documents each certificate needs' : 'जानें किस प्रमाण पत्र के लिए कौन-से दस्तावेज़ चाहिए'}
            </span>
          </div>
        </div>

        <div className="welcome-nav-controls">
          {LAUNCHER_URL && (
            <a
              href={LAUNCHER_URL}
              className="icon-btn lang-btn"
              title={isEn ? 'Back to all games' : 'सभी खेलों पर वापस'}
            >
              <Icon as={LayoutGrid} /> {isEn ? 'All games' : 'सभी खेल'}
            </a>
          )}
          <button
            type="button"
            onClick={onToggleLang}
            className="icon-btn lang-btn"
            title={isEn ? 'Switch to Hindi (हिंदी)' : 'Switch to English'}
          >
            <Icon as={Languages} /> {isEn ? 'हिंदी' : 'English'}
          </button>
          <button
            type="button"
            onClick={onToggleAudio}
            className="icon-btn"
            title={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isAudioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            <Icon as={isAudioMuted ? VolumeX : Volume2} />
          </button>
        </div>
      </header>

      {/* Main Hero Arena Content */}
      <main className="welcome-hero-arena">
        {/* Central Brand Title */}
        <div className="welcome-title-cluster">
          <h1 className="welcome-grand-title kinetic-title-group" aria-label="Document Dash">
            <span className="kinetic-word word-3" style={{ '--word-delay': '0.05s' }}>DOCUMENT</span>
            <span className="kinetic-word word-4" style={{ '--word-delay': '0.15s' }}>DASH</span>
          </h1>

          <p className="welcome-hero-subtitle">
            {isEn
              ? 'Match official documents to Chhattisgarh certificates and beat the 1-minute race!'
              : 'सही दस्तावेज़ों को छत्तीसगढ़ के प्रमाण पत्रों से मिलाएं और १ मिनट की घड़ी को मात दें!'}
          </p>
        </div>

        <div className="welcome-entry-layout">
          {/* How to play */}
          <section className="how-to-play" aria-labelledby="how-to-play-title">
            <h2 id="how-to-play-title" className="how-to-play-title">
              {isEn ? 'How to play' : 'कैसे खेलें'}
            </h2>
            <ol className="how-to-play-steps">
              {HOW_TO_PLAY.map((step, i) => (
                <li key={step.title_en} className="how-to-play-step">
                  <span className="how-to-play-num">{i + 1}</span>
                  <span className="how-to-play-icon"><Icon as={step.icon} /></span>
                  <div className="how-to-play-text">
                    <strong>{isEn ? step.title_en : step.title_hi}</strong>
                    <p>{isEn ? step.text_en : step.text_hi}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Name entry with on-screen keyboard */}
          <section className="name-entry-card" aria-labelledby="name-entry-title">
            <div className="name-entry-head">
              <h2 id="name-entry-title" className="name-entry-title">
                {isEn ? 'Enter your name' : 'अपना नाम लिखें (अंग्रेज़ी में)'}
              </h2>
              <p className="name-entry-note">
                <Icon as={Award} />
                {isEn
                  ? 'This name will be printed on the certificates you earn.'
                  : 'यह नाम आपके द्वारा अर्जित प्रमाण पत्रों पर छपेगा।'}
              </p>
            </div>

            <div
              className={`name-entry-field ${name ? '' : 'is-empty'}`}
              role="textbox"
              aria-readonly="true"
              aria-label={isEn ? 'Your name' : 'आपका नाम'}
            >
              <span className="name-entry-value">
                {name || (isEn ? 'Your name' : 'आपका नाम')}
              </span>
              <span className="name-entry-caret" aria-hidden="true" />
              <span className="name-entry-count">{name.length}/{NAME_MAX_LENGTH}</span>
            </div>

            <NameKeyboard lang={lang} disabled={isLaunching} onKey={handleKey} onEnter={handleLaunch} />

            <button
              type="button"
              className="terminal-start-cta"
              onClick={handleLaunch}
              disabled={!canStart || isLaunching}
            >
              <span className="cta-conic-glow" />
              <span className="cta-content-row">
                <span className="cta-flag-icon"><Icon as={Flag} /></span>
                <span className="cta-main-text">
                  {canStart
                    ? (isEn ? 'START 1-MIN RACE' : '१ मिनट की रेस शुरू करें')
                    : (isEn ? 'TYPE YOUR NAME TO START' : 'शुरू करने के लिए नाम लिखें')}
                </span>
                <span className="cta-lightning-bolt"><Icon as={Rocket} /></span>
              </span>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
