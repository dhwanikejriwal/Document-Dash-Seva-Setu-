import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Trophy, Star, Zap, Timer, Flag, Sparkles, Flame, Target, CircleX } from 'lucide-react';
import Icon from './Icon';
import './ArcadeAnimations.css';

// Calls `callback` once, `delay` ms after `trigger` becomes truthy or changes.
// The callback is read from a ref, so the parent re-rendering every second for the
// game clock (which hands us a new callback each time) doesn't restart the timer.
function useTimeout(callback, delay, trigger) {
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!trigger) return;
    const timer = setTimeout(() => callbackRef.current(), delay);
    return () => clearTimeout(timer);
  }, [delay, trigger]);
}

// 1. Full-Screen Certificate Unlocked Trophy Slam Animation (Like 1-2-3 Countdown)
export function CertificateUnlockAnimation({ certificate, lang, onFinish }) {
  const isEn = lang === 'en';

  useTimeout(onFinish, 1800, certificate);

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
        <div className="unlock-trophy-icon" style={{ '--cert-color': certificate.color }}>
          <span className="trophy-emoji"><Icon as={Trophy} /></span>
          <span className="cert-sub-emoji"><Icon as={certificate.icon} /></span>
        </div>

        {/* Slamming Glowing Title */}
        <div className="unlock-text-group">
          <div className="unlock-eyebrow-badge">
            <Icon as={Star} /> {isEn ? 'CERTIFICATE UNLOCKED!' : 'प्रमाण पत्र अनलॉक!'} <Icon as={Star} />
          </div>
          <h1 className="unlock-main-name">
            {isEn ? certificate.name_en : certificate.name_hi}
          </h1>
          <div className="unlock-bonus-pill">
            <span><Icon as={Zap} /> +500 XP BONUS!</span>
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

  useTimeout(onFinish, 1300, true);

  return (
    <div className="arcade-fullscreen-overlay timeup-finish-overlay" onClick={onFinish}>
      {/* Red/Amber Warning Rings */}
      <div className="timeup-hazard-ring ring-1" />
      <div className="timeup-hazard-ring ring-2" />

      <div className="timeup-content-box">
        <div className="timeup-flag-icon"><Icon as={Timer} /></div>
        <h1 className="timeup-slam-text">
          {isEn ? "TIME'S UP!" : "समय समाप्त!"}
        </h1>
        <div className="timeup-finish-tag">
          <Icon as={Flag} /> {isEn ? 'CALCULATING OFFICIAL SCORE...' : 'आधिकारिक स्कोर गणना जारी...'}
        </div>
      </div>
    </div>
  );
}

// 3. Floating Arcade Combo & Match Explosions
export function ComboBurstBanner({ comboData, onDismiss }) {
  useTimeout(onDismiss, 900, comboData);

  if (!comboData) return null;

  const { combo, points, text } = comboData;
  const isMulti = combo > 1;

  return (
    <div className={`arcade-combo-burst ${isMulti ? 'burst-multi' : 'burst-single'}`}>
      <div className="burst-stars-sparkle"><Icon as={Sparkles} /></div>
      <div className="burst-content">
        <span className="burst-flame"><Icon as={isMulti ? Flame : Target} /></span>
        <span className="burst-text">{text}</span>
        <span className="burst-points">+{points}</span>
      </div>
    </div>
  );
}

// 4. Arcade Mismatch / Wrong Bucket Animation
export function MismatchAlert({ alertData, onDismiss }) {
  useTimeout(onDismiss, 800, alertData);

  if (!alertData) return null;

  return (
    <div className="arcade-mismatch-banner">
      <span className="mismatch-icon"><Icon as={CircleX} /></span>
      <span className="mismatch-text">{alertData.text || 'WRONG BUCKET!'}</span>
    </div>
  );
}
