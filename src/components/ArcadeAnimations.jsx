import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Trophy, Timer, Flag, Sparkles, Flame, Target, CircleX } from 'lucide-react';
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

// 1. Certificate completed: a small notice over the empty middle of the arena.
// It ignores touches (pointer-events: none), so play continues underneath it.
export function CertificateUnlockNotice({ certificate, lang, onFinish }) {
  const isEn = lang === 'en';

  useTimeout(onFinish, 1800, certificate);

  if (!certificate) return null;

  return (
    <div
      key={certificate.id}
      className="unlock-notice"
      role="status"
      style={{ '--cert-color': certificate.color, '--cert-solid': certificate.solid }}
    >
      <span className="unlock-notice-icon"><Icon as={certificate.icon} /></span>
      <div className="unlock-notice-text">
        <span className="unlock-notice-eyebrow">
          <Icon as={Trophy} /> {isEn ? 'Certificate complete!' : 'प्रमाण पत्र पूर्ण!'}
        </span>
        <strong className="unlock-notice-name">{isEn ? certificate.name_en : certificate.name_hi}</strong>
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
