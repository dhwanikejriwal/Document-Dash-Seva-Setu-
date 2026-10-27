import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../audio';
import { CERTIFICATES } from '../data/certificates';

export default function ScreenSaver({ onWakeUp, lang = 'en', theme = 'light' }) {
  const isEn = lang === 'en';
  const canvasRef = useRef(null);
  const [palette, setPalette] = useState('sunset'); // 'sunset' | 'emerald' | 'violet' | 'pearl'

  // Text Transition Index (Smooth 3D flip text animation)
  const [textIndex, setTextIndex] = useState(0);
  const actionTextSequence = isEn ? [
    { tag: 'STEP 1', text: '🎯 DRAG & MATCH PREREQUISITE DOCUMENTS' },
    { tag: 'STEP 2', text: '⚡ CHAIN HIGH-SPEED COMBOS & MULTIPLIERS' },
    { tag: 'STEP 3', text: '🏆 UNLOCK ALL 4 CITIZEN CERTIFICATES' },
    { tag: 'STEP 4', text: '⏱️ BEAT THE 45-SECOND RAPID CITIZEN TIMER' }
  ] : [
    { tag: 'चरण १', text: '🎯 आवश्यक दस्तावेज़ों को सही बास्केट में ड्रैग करें' },
    { tag: 'चरण २', text: '⚡ तेज गति से कॉम्बो और अंक अर्जित करें' },
    { tag: 'चरण ३', text: '🏆 सभी ४ सरकारी प्रमाण पत्र अनलॉक करें' },
    { tag: 'चरण ४', text: '⏱️ ४५ सेकंड की घड़ी को मात दें' }
  ];

  // Animated Gameplay Demo Video Reel Step
  const [videoStep, setVideoStep] = useState(0);
  const videoClips = [
    {
      docIcon: '📜',
      docTitle: isEn ? 'Statutory Affidavit' : 'वैधानिक शपथ पत्र',
      docTag: isEn ? 'Legal Declaration' : 'शपथ पत्र',
      targetName: isEn ? 'Domicile Certificate' : 'निवास प्रमाण पत्र',
      targetIcon: '🏠',
      targetColor: '#0077ff',
      xp: '+150 XP',
      combo: 'COMBO 1x',
      progress: '33%',
      unlocked: false
    },
    {
      docIcon: '🎓',
      docTitle: isEn ? 'Educational Marksheet' : 'शैक्षणिक अंकसूची',
      docTag: isEn ? 'Education' : 'शिक्षा',
      targetName: isEn ? 'Domicile Certificate' : 'निवास प्रमाण पत्र',
      targetIcon: '🏠',
      targetColor: '#0077ff',
      xp: '+300 XP',
      combo: 'COMBO 2x 🔥',
      progress: '66%',
      unlocked: false
    },
    {
      docIcon: '🏠',
      docTitle: isEn ? '15-Yr Stay Proof' : '१५ वर्ष निवास प्रमाण',
      docTag: isEn ? '15 Years Residence' : 'निवास प्रमाण',
      targetName: isEn ? 'Domicile Certificate' : 'निवास प्रमाण पत्र',
      targetIcon: '🏠',
      targetColor: '#0077ff',
      xp: '+500 XP BONUS',
      combo: 'ULTRA 3x ⚡',
      progress: '100%',
      unlocked: true
    },
    {
      docIcon: '💰',
      docTitle: isEn ? 'Income Proof' : 'आय प्रमाण प्रतिवेदन',
      docTag: isEn ? 'Income' : 'आय प्रमाण',
      targetName: isEn ? 'Income Certificate' : 'आय प्रमाण पत्र',
      targetIcon: '💰',
      targetColor: '#ea580c',
      xp: '+300 XP',
      combo: 'PERFECT MATCH! 🎯',
      progress: '50%',
      unlocked: false
    }
  ];

  // Rotate kinetic text transition every 2.4s
  useEffect(() => {
    const textTimer = setInterval(() => {
      setTextIndex(prev => (prev + 1) % actionTextSequence.length);
    }, 2400);
    return () => clearInterval(textTimer);
  }, [actionTextSequence.length]);

  // Rotate animated video reel every 2.6s
  useEffect(() => {
    const videoTimer = setInterval(() => {
      setVideoStep(prev => (prev + 1) % videoClips.length);
    }, 2600);
    return () => clearInterval(videoTimer);
  }, [videoClips.length]);

  // High-performance Particle Spark & Ripple Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];
    let sparks = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const colors = ['#f97316', '#f59e0b', '#10b981', '#06b6d4', '#ec4899'];
      for (let i = 0; i < 45; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: 1.5 + Math.random() * 2.5,
          alpha: 0.25 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          color: colors[i % colors.length]
        });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Interactive pointer sparks
    const addSparks = (x, y) => {
      const colors = ['#f97316', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#ffffff'];
      for (let i = 0; i < 16; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.8 + Math.random() * 4;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 2.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.022 + Math.random() * 0.02
        });
      }
    };

    const handlePointerMove = (e) => {
      addSparks(e.clientX, e.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Floating Dust
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 2. Interactive Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  const handleWake = () => {
    sound.playPickup();
    onWakeUp();
  };

  const currentAction = actionTextSequence[textIndex];
  const currentClip = videoClips[videoStep];

  return (
    <div
      className={`screensaver-attract-overlay screensaver-enhanced palette-${palette}`}
      onClick={handleWake}
      onKeyDown={handleWake}
      tabIndex={0}
      role="button"
      aria-label="Touch anywhere to play"
    >
      {/* Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="screensaver-particle-canvas" />

      {/* Top Header Bar with Live Palette Picker */}
      <header className="screensaver-enhanced-header">
        <div className="screensaver-gov-pill">
          <span className="gov-emblem-icon">🏛️</span>
          <span>{isEn ? 'GOVERNMENT OF CHHATTISGARH • CHiPS // SEVA SETU' : 'छत्तीसगढ़ शासन • चिप्स // सेवा सेतु'}</span>
          <span className="live-dot-pulse" />
        </div>

        {/* Live Color Switcher Pills */}
        <div className="screensaver-palette-bar" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`screensaver-palette-btn ${palette === 'sunset' ? 'active-palette' : ''}`}
            onClick={() => { sound.playPickup(); setPalette('sunset'); }}
            title="Warm Sunset Gold Theme"
          >
            🌅 {isEn ? 'Sunset Gold' : 'सूर्योदय'}
          </button>
          <button
            type="button"
            className={`screensaver-palette-btn ${palette === 'emerald' ? 'active-palette' : ''}`}
            onClick={() => { sound.playPickup(); setPalette('emerald'); }}
            title="Fresh Emerald Forest Theme"
          >
            🌿 {isEn ? 'Emerald' : 'हरित वन'}
          </button>
          <button
            type="button"
            className={`screensaver-palette-btn ${palette === 'violet' ? 'active-palette' : ''}`}
            onClick={() => { sound.playPickup(); setPalette('violet'); }}
            title="Electric Twilight Violet Theme"
          >
            🌌 {isEn ? 'Twilight' : 'सांध्य रंग'}
          </button>
          <button
            type="button"
            className={`screensaver-palette-btn ${palette === 'pearl' ? 'active-palette' : ''}`}
            onClick={() => { sound.playPickup(); setPalette('pearl'); }}
            title="Crystal Pearl Cyan Theme"
          >
            ☁️ {isEn ? 'Crystal' : 'श्वेत आभा'}
          </button>
        </div>
      </header>

      {/* Center Cinematic Stage */}
      <div className="screensaver-center-showcase">
        {/* Holographic Glowing Rings */}
        <div className="screensaver-portal-rings">
          <div className="portal-concentric-ring ring-primary" />
          <div className="portal-concentric-ring ring-secondary" />
          <div className="portal-concentric-ring ring-accent" />
        </div>

        {/* Grand Title with Continuous Shimmer Wave Transition */}
        <div className="screensaver-hero-unit">
          <div className="screensaver-robot-mascot">
            <span className="mascot-face">🤖</span>
            <div className="mascot-aura-glow" />
          </div>

          <h1 className="screensaver-title-gradient shimmer-transition-text">
            SEVA SETU • DOCUMENT DASH
          </h1>

          {/* Animated 3D Text Transition Ribbon */}
          <div key={textIndex} className="screensaver-kinetic-ribbon">
            <span className="kinetic-step-badge">{currentAction.tag}</span>
            <span className="kinetic-action-text">{currentAction.text}</span>
          </div>

          {/* Animated Video Simulation Reel: Curved Holographic Monitor */}
          <div className="screensaver-video-cinema" onClick={(e) => e.stopPropagation()}>
            <div className="cinema-header-bar">
              <div className="cinema-rec-group">
                <span className="cinema-rec-dot" />
                <span className="cinema-rec-label">
                  {isEn ? 'ANIMATED GAMEPLAY TRAILER' : 'एनिमेटेड गेमप्ले ट्रेलर'}
                </span>
              </div>
              <span className="cinema-fps-pill">60 FPS ⚡ HD</span>
            </div>

            {/* Video Viewport: 60 FPS Animated Action Loop */}
            <div className="cinema-viewport">
              {/* Flying Animated Document Card */}
              <div className="cinema-flying-card" key={`doc-${videoStep}`}>
                <div className="card-mini-stamp">{currentClip.docIcon}</div>
                <div className="card-mini-info">
                  <span className="card-mini-title">{currentClip.docTitle}</span>
                  <span className="card-mini-tag">{currentClip.docTag}</span>
                </div>
              </div>

              {/* Glowing Dynamic Trajectory Beam */}
              <div className="cinema-flight-trajectory">
                <div className="trajectory-beam" />
                <span className="trajectory-arrow">➔</span>
              </div>

              {/* Target Animated Certificate Bucket */}
              <div
                className={`cinema-target-basket ${currentClip.unlocked ? 'basket-gold-trophy' : ''}`}
                style={{ '--target-color': currentClip.targetColor }}
              >
                <div className="target-basket-badge">
                  <span>{currentClip.unlocked ? '🏆' : currentClip.targetIcon}</span>
                  <strong>{currentClip.targetName}</strong>
                </div>

                {/* Animated Liquid Gauge */}
                <div className="target-gauge-mini">
                  <div className="gauge-fill-mini" style={{ width: currentClip.progress }} />
                </div>
                <span className="gauge-pct-mini">{currentClip.progress}</span>
              </div>

              {/* Dynamic Score & Combo Floating Bursts */}
              <div className="cinema-burst-floater" key={`burst-${videoStep}`}>
                <span className="burst-chip-xp">{currentClip.xp}</span>
                <span className="burst-chip-combo">{currentClip.combo}</span>
                {currentClip.unlocked && (
                  <span className="burst-chip-unlocked">🌟 UNLOCKED!</span>
                )}
              </div>
            </div>
          </div>

          {/* Glowing High-Tech Touch To Play Beacon */}
          <div className="screensaver-touch-beacon">
            <span className="beacon-sparkle">✨</span>
            <span className="beacon-finger">👆</span>
            <span className="beacon-main-text">
              {isEn ? 'TOUCH ANYWHERE TO PLAY' : 'खेलने के लिए कहीं भी छुएं'}
            </span>
            <span className="beacon-rocket">🚀</span>
          </div>

          <p className="screensaver-hint-text">
            {isEn
              ? 'Tap screen or press any key to start 45s race'
              : '४५ सेकंड की रेस शुरू करने के लिए स्क्रीन पर टैप करें'}
          </p>
        </div>

        {/* 4 Floating Hologram Certificate Badges */}
        <div className="screensaver-cert-preview-bar">
          {CERTIFICATES.map(cert => (
            <div
              key={cert.id}
              className="screensaver-cert-preview-pill"
              style={{ '--cert-theme': cert.color }}
            >
              <span className="cert-preview-icon">{cert.icon}</span>
              <span className="cert-preview-title">
                {isEn ? cert.name_en : cert.name_hi}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Floating Stats Strip */}
      <footer className="screensaver-enhanced-footer">
        <div className="screensaver-stats-strip">
          <span>⚡ 45s ARCADE TIMER</span>
          <span>•</span>
          <span>📜 100% OFFICIAL CG PREREQUISITES</span>
          <span>•</span>
          <span>🌟 INSTANT VERIFIED DIGITAL DOWNLOADS</span>
        </div>
      </footer>
    </div>
  );
}
