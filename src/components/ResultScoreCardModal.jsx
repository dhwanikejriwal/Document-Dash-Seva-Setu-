import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CERTIFICATES } from '../data/certificates';

export default function ResultScoreCardModal({
  participantName,
  score,
  unlockedCertificates = [],
  correctSortsCount = 0,
  highestCombo = 1,
  timeExpired = true,
  lang = 'en',
  onViewCertificate,
  onNextParticipant,
  onRetry
}) {
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
        title_en: '⭐⭐⭐ Master Document Officer',
        title_hi: '⭐⭐⭐ मुख्य दस्तावेज़ अधिकारी',
        color: '#ffd700',
        bg: 'rgba(255, 215, 0, 0.2)',
        border: '#ffd700'
      };
    }
    if (unlockedCount >= 2) {
      return {
        title_en: '⭐⭐ Certified Citizen Specialist',
        title_hi: '⭐⭐ प्रमाणित नागरिक विशेषज्ञ',
        color: '#00e676',
        bg: 'rgba(0, 230, 118, 0.2)',
        border: '#00e676'
      };
    }
    if (unlockedCount >= 1) {
      return {
        title_en: '⭐ Document Explorer',
        title_hi: '⭐ दस्तावेज़ अन्वेषक',
        color: '#00d2ff',
        bg: 'rgba(0, 210, 255, 0.2)',
        border: '#00d2ff'
      };
    }
    return {
      title_en: 'Rookie Citizen (Keep Learning)',
      title_hi: 'प्रशिक्षु नागरिक (अभ्यास जारी रखें)',
      color: '#94a3b8',
      bg: 'rgba(148, 163, 184, 0.2)',
      border: '#94a3b8'
    };
  };

  const rank = getRankBadge();

  return (
    <div className="modal-overlay active" role="dialog" aria-modal="true">
      <div className="scorecard-cyber-box">
        {/* Header */}
        <div className="scorecard-header">
          <div className="scorecard-flag-badge">🏁</div>
          <div>
            <h2 className="scorecard-title">
              {timeExpired
                ? (isEn ? "TIME'S UP!" : "समय समाप्त!")
                : (isEn ? "QUEST COMPLETED!" : "क्वेस्ट पूर्ण!")}
            </h2>
          </div>
        </div>

        {/* Participant Name Badge */}
        <div className="scorecard-participant-banner">
          <div className="participant-info-left">
            <span className="banner-sub-label">
              {isEn ? 'Citizen Participant / नागरिक प्रतिभागी' : 'नागरिक प्रतिभागी'}
            </span>
            <h3 className="banner-participant-name">
              👤 {participantName || (isEn ? 'Citizen Participant' : 'नागरिक')}
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
                    borderColor: isThisUnlocked ? c.color : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <span className="cert-card-icon">{c.icon}</span>
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
                      📜 {isEn ? 'View Cert' : 'देखें'}
                    </button>
                  ) : (
                    <span className="cert-card-locked-text">
                      🔒 {isEn ? 'Locked' : 'अपूर्ण'}
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
            👥 {isEn ? 'NEXT PARTICIPANT (अगला प्रतिभागी)' : 'अगला प्रतिभागी (नया सत्र)'}
          </button>

          <button
            type="button"
            className="scorecard-btn-retry"
            onClick={onRetry}
          >
            🔄 {isEn ? 'Try Again (पुनः प्रयास)' : 'पुनः प्रयास करें'}
          </button>
        </div>
      </div>
    </div>
  );
}
