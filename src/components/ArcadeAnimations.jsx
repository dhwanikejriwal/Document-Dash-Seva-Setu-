import React, { useEffect } from 'react';

// 1. Full-Screen Certificate Unlocked Trophy Slam Animation (Like 1-2-3 Countdown)
export function CertificateUnlockAnimation({ certificate, lang, onFinish }) {
  const isEn = lang === 'en';

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!certificate) return null;

  return (
    <div className="arcade-fullscreen-overlay unlock-celebration-overlay" onClick={onFinish}>
      {/* Concentric Golden Shockwave Rings */}
      <div className="unlock-shockwave-ring ring-1" />
      <div className="unlock-shockwave-ring ring-2" />
      <div className="unlock-shockwave-ring ring-3" />

      {/* Rotating Sunburst Rays */}
      <div className="unlock-sunburst-rays" />

      <div className="unlock-content-card">
        {/* Giant Trophy / Stamp with Slam Animation */}
        <div className="unlock-trophy-icon">
          <span className="trophy-emoji">🏆</span>
          <span className="cert-sub-emoji">{certificate.icon}</span>
        </div>

        {/* Slamming Glowing Title */}
        <div className="unlock-text-group">
          <div className="unlock-eyebrow-badge">
            ⭐ {isEn ? 'CERTIFICATE UNLOCKED!' : 'प्रमाण पत्र अनलॉक!'} ⭐
          </div>
          <h1 className="unlock-main-name">
            {isEn ? certificate.name_en : certificate.name_hi}
          </h1>
          <div className="unlock-bonus-pill">
            <span>⚡ +500 XP BONUS!</span>
            <span>•</span>
            <span>100% COMPLETE!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Full-Screen Dramatic TIME'S UP! Animation (Like 1-2-3 Countdown)
export function TimeUpAnimation({ lang, onFinish }) {
  const isEn = lang === 'en';

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1300);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="arcade-fullscreen-overlay timeup-finish-overlay" onClick={onFinish}>
      {/* Red/Amber Warning Rings */}
      <div className="timeup-hazard-ring ring-1" />
      <div className="timeup-hazard-ring ring-2" />

      <div className="timeup-content-box">
        <div className="timeup-flag-icon">⏱️</div>
        <h1 className="timeup-slam-text">
          {isEn ? "TIME'S UP!" : "समय समाप्त!"}
        </h1>
        <div className="timeup-finish-tag">
          🏁 {isEn ? 'CALCULATING OFFICIAL SCORE...' : 'आधिकारिक स्कोर गणना जारी...'}
        </div>
      </div>
    </div>
  );
}

// 3. Floating Arcade Combo & Match Explosions
export function ComboBurstBanner({ comboData, onDismiss }) {
  useEffect(() => {
    if (!comboData) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 900);
    return () => clearTimeout(timer);
  }, [comboData, onDismiss]);

  if (!comboData) return null;

  const { combo, points, text } = comboData;
  const isMulti = combo > 1;

  return (
    <div className={`arcade-combo-burst ${isMulti ? 'burst-multi' : 'burst-single'}`}>
      <div className="burst-stars-sparkle">✨</div>
      <div className="burst-content">
        <span className="burst-flame">{isMulti ? '🔥' : '🎯'}</span>
        <span className="burst-text">{text}</span>
        <span className="burst-points">+{points}</span>
      </div>
    </div>
  );
}

// 4. Arcade Mismatch / Wrong Bucket Animation
export function MismatchAlert({ alertData, onDismiss }) {
  useEffect(() => {
    if (!alertData) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 800);
    return () => clearTimeout(timer);
  }, [alertData, onDismiss]);

  if (!alertData) return null;

  return (
    <div className="arcade-mismatch-banner">
      <span className="mismatch-icon">❌</span>
      <span className="mismatch-text">{alertData.text || 'WRONG BUCKET!'}</span>
    </div>
  );
}
