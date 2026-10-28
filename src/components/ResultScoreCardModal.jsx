import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Flag, Star, User, ScrollText, Lock, Users, RotateCcw, Hourglass } from 'lucide-react';
import { CERTIFICATES } from '../data/certificates';
import Icon from './Icon';
import './ResultScoreCardModal.css';

export default function ResultScoreCardModal({
  participantName,
  score,
  unlockedCertificates = [],
  correctSortsCount = 0,
  highestCombo = 1,
  timeExpired = true,
  lang = 'en',
  idleSecondsLeft = Infinity,
  onViewCertificate,
  onNextParticipant,
  onRetry
}) {
  // Warn before the kiosk clears this score card for the next participant
  const RESET_WARNING_SECONDS = 20;
  const isEn = lang === 'en';
  const unlockedCount = unlockedCertificates.length;

  useEffect(() => {
    if (unlockedCount > 0) {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  }, [unlockedCount]);

  const getRankBadge = () => {
    if (unlockedCount >= 4) {
      return {
        stars: 3,
        title_en: 'Master Document Officer',
        title_hi: 'मुख्य दस्तावेज़ अधिकारी',
        color: 'var(--gold-300)',
        bg: 'rgba(var(--gold-300-rgb), 0.2)',
        border: 'var(--gold-300)'
      };
    }
    if (unlockedCount >= 2) {
      return {
        stars: 2,
        title_en: 'Certified Citizen Specialist',
        title_hi: 'प्रमाणित नागरिक विशेषज्ञ',
        color: 'var(--green-400)',
        bg: 'rgba(var(--green-400-rgb), 0.2)',
        border: 'var(--green-400)'
      };
    }
    if (unlockedCount >= 1) {
      return {
        stars: 1,
        title_en: 'Document Explorer',
        title_hi: 'दस्तावेज़ अन्वेषक',
        color: 'var(--cyan-400)',
        bg: 'rgba(var(--cyan-400-rgb), 0.2)',
        border: 'var(--cyan-400)'
      };
    }
    return {
      stars: 0,
      title_en: 'Rookie Citizen (Keep Learning)',
      title_hi: 'प्रशिक्षु नागरिक (अभ्यास जारी रखें)',
      color: 'var(--ink-400)',
      bg: 'rgba(var(--ink-400-rgb), 0.2)',
      border: 'var(--ink-400)'
    };
  };

  const rank = getRankBadge();

  // Completion wins over the clock; finishing early with certificates left is its own ending
  const isQuestComplete = unlockedCount === CERTIFICATES.length;
  const title = isQuestComplete
    ? (isEn ? 'QUEST COMPLETED!' : 'क्वेस्ट पूर्ण!')
    : timeExpired
      ? (isEn ? "TIME'S UP!" : 'समय समाप्त!')
      : (isEn ? 'RACE FINISHED!' : 'रेस समाप्त!');

  return (
    <div className="modal-overlay active" role="dialog" aria-modal="true">
      <div className="scorecard-cyber-box">
        {/* Header */}
        <div className="scorecard-header">
          <div className="scorecard-flag-badge"><Icon as={Flag} /></div>
          <div>
            <h2 className="scorecard-title">{title}</h2>
          </div>
        </div>

        {/* Participant Name Badge */}
        <div className="scorecard-participant-banner">
          <div className="participant-info-left">
            <span className="banner-sub-label">
              {isEn ? 'Citizen Participant / नागरिक प्रतिभागी' : 'नागरिक प्रतिभागी'}
            </span>
            <h3 className="banner-participant-name">
              <Icon as={User} /> {participantName || (isEn ? 'Citizen Participant' : 'नागरिक')}
            </h3>
          </div>

          <div
            className="rank-award-badge"
            style={{
              color: rank.color,
              background: rank.bg,
              borderColor: rank.border
            }}
          >
            {Array.from({ length: rank.stars }, (_, i) => <Icon key={i} as={Star} fill="currentColor" />)}
            {rank.stars > 0 && ' '}
            {isEn ? rank.title_en : rank.title_hi}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="scorecard-stats-grid">
          <div className="score-stat-tile stat-cert">
            <span className="stat-label">{isEn ? 'Certificates' : 'प्रमाण पत्र'}</span>
            <strong className="stat-value">{unlockedCount} / 4</strong>
            <span className="stat-pill">{Math.round((unlockedCount / 4) * 100)}% Complete</span>
          </div>

          <div className="score-stat-tile stat-score">
            <span className="stat-label">{isEn ? 'Total Points' : 'अंतिम स्कोर'}</span>
            <strong className="stat-value">{score}</strong>
            <span className="stat-pill">XP Earned</span>
          </div>

          <div className="score-stat-tile stat-accuracy">
            <span className="stat-label">{isEn ? 'Correct Sorts' : 'सफल दस्तावेज़'}</span>
            <strong className="stat-value">{correctSortsCount}</strong>
            <span className="stat-pill">Accurate</span>
          </div>

          <div className="score-stat-tile stat-combo">
            <span className="stat-label">{isEn ? 'Max Combo' : 'अधिकतम कॉम्बो'}</span>
            <strong className="stat-value">{highestCombo}x</strong>
            <span className="stat-pill">Multiplier</span>
          </div>
        </div>

        {/* Generated Certificates Showcase */}
        <div className="scorecard-cert-section">
          <h4 className="cert-section-heading">
            {isEn ? 'Generated Digital Certificates:' : 'उत्पन्न डिजिटल प्रमाण पत्र:'}
          </h4>

          <div className="scorecard-certs-row">
            {CERTIFICATES.map(c => {
              const isThisUnlocked = unlockedCertificates.includes(c.id);
              return (
                <div
                  key={c.id}
                  className={`scorecard-cert-card ${isThisUnlocked ? 'card-unlocked' : 'card-locked'}`}
                  style={{
                    '--cert-color': c.color,
                    borderColor: isThisUnlocked ? c.color : 'rgba(var(--white-rgb), 0.1)'
                  }}
                >
                  <span className="cert-card-icon"><Icon as={c.icon} /></span>
                  <span className="cert-card-title">
                    {isEn ? c.name_en.split(' ')[0] : c.name_hi.split(' ')[0]}
                  </span>
                  {isThisUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onViewCertificate(c.id)}
                      className="cert-card-view-btn"
                      style={{ background: c.gradient }}
                    >
                      <Icon as={ScrollText} /> {isEn ? 'View Cert' : 'देखें'}
                    </button>
                  ) : (
                    <span className="cert-card-locked-text">
                      <Icon as={Lock} /> {isEn ? 'Locked' : 'अपूर्ण'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons: Next Participant vs Retry */}
        <div className="scorecard-actions-row">
          <button
            type="button"
            className="scorecard-btn-next"
            onClick={onNextParticipant}
          >
            <Icon as={Users} /> {isEn ? 'NEXT PARTICIPANT (अगला प्रतिभागी)' : 'अगला प्रतिभागी (नया सत्र)'}
          </button>

          <button
            type="button"
            className="scorecard-btn-retry"
            onClick={onRetry}
          >
            <Icon as={RotateCcw} /> {isEn ? 'Try Again (पुनः प्रयास)' : 'पुनः प्रयास करें'}
          </button>
        </div>

        {idleSecondsLeft <= RESET_WARNING_SECONDS && (
          <p className="scorecard-reset-notice" aria-live="polite">
            <Icon as={Hourglass} />
            {isEn
              ? `Starting over for the next participant in ${idleSecondsLeft}s. Tap anywhere to stay.`
              : `${idleSecondsLeft} सेकंड में अगले प्रतिभागी के लिए नया सत्र शुरू होगा। रुकने के लिए कहीं भी टैप करें।`}
          </p>
        )}
      </div>
    </div>
  );
}
