import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Flag, Star, User, ScrollText, Users, RotateCcw, Hourglass, Award, CircleCheck, CircleX, Timer, CloudOff, RotateCw
} from 'lucide-react';
import { CERTIFICATES, isRequirementMet, metRequirementCount, mandatoryRequirements } from '../data/certificates';
import { DOCUMENTS } from '../data/documents';
import { formatTimeTaken } from '../api/certificate';
import Icon from './Icon';
import './ResultScoreCardModal.css';

const DOCUMENT_BY_ID = Object.fromEntries(DOCUMENTS.map(doc => [doc.id, doc]));

// Warn before the kiosk clears this score card for the next participant
const RESET_WARNING_SECONDS = 20;

// How many accepted documents to suggest for a missed document type
const MISSED_EXAMPLES = 2;

// The winner's certificate from the certificate service, shown as a QR code to scan.
// `certificate.status` is 'loading', 'ready' or 'error' (see requestWinnerCertificate in App).
function WinnerCertificatePanel({ certificate, timeTakenSeconds, lang, onRetry }) {
  const isEn = lang === 'en';
  const { status } = certificate;

  const copy = {
    ready: {
      title: isEn ? 'Your certificate is ready!' : 'आपका प्रमाण पत्र तैयार है!',
      body: isEn ? 'Scan this QR code with your phone to download it.' : 'इसे डाउनलोड करने के लिए अपने फ़ोन से यह क्यूआर कोड स्कैन करें।'
    },
    error: {
      title: isEn ? "Couldn't create your certificate" : 'प्रमाण पत्र नहीं बन सका',
      body: isEn ? 'Check the internet connection and try again.' : 'इंटरनेट कनेक्शन जांचें और फिर से कोशिश करें।'
    },
    loading: {
      title: isEn ? 'Creating your certificate…' : 'आपका प्रमाण पत्र बन रहा है…',
      body: isEn ? 'This takes a few seconds.' : 'इसमें कुछ सेकंड लगते हैं।'
    }
  }[status] || {};

  return (
    <section className={`winner-cert winner-cert--${status}`} aria-live="polite">
      <div className="winner-cert-qr">
        {status === 'ready' && (
          <img src={certificate.qrCode} alt={isEn ? 'QR code for your certificate' : 'आपके प्रमाण पत्र का क्यूआर कोड'} />
        )}
        {status === 'error' && <Icon as={CloudOff} />}
        {status === 'loading' && <span className="winner-cert-spinner" aria-hidden="true" />}
      </div>

      <div className="winner-cert-text">
        <strong className="winner-cert-title">{copy.title}</strong>
        <p className="winner-cert-body">{copy.body}</p>
        <span className="winner-cert-time">
          <Icon as={Timer} /> {isEn ? 'Time taken' : 'लिया गया समय'}: {formatTimeTaken(timeTakenSeconds)}
        </span>
        {status === 'error' && (
          <button type="button" className="winner-cert-retry" onClick={onRetry}>
            <Icon as={RotateCw} /> {isEn ? 'Try again' : 'फिर से कोशिश करें'}
          </button>
        )}
      </div>
    </section>
  );
}

// One certificate in the end-of-round recap: each required document type, ticked with
// the document the player used, or crossed with examples of what would have fitted.
function CertificateRecap({ certificate, collectedDocIds, isUnlocked, lang, onViewCertificate }) {
  const isEn = lang === 'en';
  const docTitle = doc => (isEn ? doc.title_en : doc.title_hi);
  // Optional types only appear when the player actually used one
  const rows = certificate.requirements.filter(req => req.mandatory || isRequirementMet(req, collectedDocIds));

  return (
    <section
      className={`recap-card ${isUnlocked ? 'is-complete' : ''}`}
      style={{ '--cert-color': certificate.color, '--cert-solid': certificate.solid }}
    >
      <header className="recap-card-head">
        <span className="recap-card-icon"><Icon as={certificate.icon} /></span>
        <strong className="recap-card-name">{isEn ? certificate.name_en : certificate.name_hi}</strong>
        <span className="recap-card-count">
          {metRequirementCount(certificate, collectedDocIds)}/{mandatoryRequirements(certificate).length}
        </span>
      </header>

      <ul className="recap-list">
        {rows.map(req => {
          const filledBy = DOCUMENT_BY_ID[collectedDocIds.find(id => req.docIds.includes(id))];
          const hasChoices = req.docIds.length > 1;
          const examples = req.docIds.slice(0, MISSED_EXAMPLES).map(id => docTitle(DOCUMENT_BY_ID[id]));
          const moreCount = req.docIds.length - examples.length;

          return (
            <li key={req.id} className={`recap-row ${filledBy ? 'is-met' : 'is-missed'}`}>
              <Icon as={filledBy ? CircleCheck : CircleX} className="recap-status" />
              <div className="recap-row-text">
                <span className="recap-type">
                  {isEn ? req.name_en : req.name_hi}
                  {!req.mandatory && <span className="recap-optional">{isEn ? 'Optional' : 'वैकल्पिक'}</span>}
                </span>
                {/* A single-document type is named after its document, so only spell out real choices */}
                {hasChoices && filledBy && <span className="recap-detail">{docTitle(filledBy)}</span>}
                {hasChoices && !filledBy && (
                  <span className="recap-detail">
                    {isEn ? 'e.g. ' : 'जैसे '}
                    {examples.join(', ')}
                    {moreCount > 0 && (isEn ? ` +${moreCount} more` : ` +${moreCount} और`)}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {isUnlocked && (
        <button type="button" className="recap-view-btn" onClick={() => onViewCertificate(certificate.id)}>
          <Icon as={ScrollText} /> {isEn ? 'View certificate' : 'प्रमाण पत्र देखें'}
        </button>
      )}
    </section>
  );
}

export default function ResultScoreCardModal({
  participantName,
  unlockedCertificates = [],
  collectedByCertificate = {},
  correctSortsCount = 0,
  wrongSortsCount = 0,
  winnerCertificate = { status: 'idle' },
  timeTakenSeconds = 0,
  onRetryCertificate,
  timeExpired = true,
  lang = 'en',
  idleSecondsLeft = Infinity,
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

        {/* Player, round summary and (on a win) the certificate QR code side by side */}
        <div className={`scorecard-top ${isQuestComplete ? 'has-certificate' : ''}`}>
          <div className="scorecard-top-main">
            {/* Participant Name Badge */}
            <div className="scorecard-participant-banner">
              <div className="participant-info-left">
                <span className="banner-sub-label">{isEn ? 'Participant' : 'प्रतिभागी'}</span>
                <h3 className="banner-participant-name">
                  <Icon as={User} /> {participantName || (isEn ? 'Participant' : 'प्रतिभागी')}
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

            {/* Round summary */}
            <div className="scorecard-summary">
              <span className="summary-item">
                <Icon as={Award} />
                <strong>{unlockedCount}/{CERTIFICATES.length}</strong> {isEn ? 'certificates complete' : 'प्रमाण पत्र पूर्ण'}
              </span>
              <span className="summary-item summary-correct">
                <Icon as={CircleCheck} />
                <strong>{correctSortsCount}</strong>{' '}
                {isEn ? (correctSortsCount === 1 ? 'correct match' : 'correct matches') : 'सही मिलान'}
              </span>
              <span className="summary-item summary-wrong">
                <Icon as={CircleX} />
                <strong>{wrongSortsCount}</strong>{' '}
                {isEn ? (wrongSortsCount === 1 ? 'wrong try' : 'wrong tries') : 'गलत प्रयास'}
              </span>
            </div>

            {!isQuestComplete && (
              <p className="scorecard-earn-hint">
                <Icon as={Award} />
                {isEn
                  ? 'Complete all 4 certificates within a minute to earn your certificate.'
                  : 'अपना प्रमाण पत्र पाने के लिए एक मिनट में चारों प्रमाण पत्र पूरे करें।'}
              </p>
            )}
          </div>

          {isQuestComplete && (
            <WinnerCertificatePanel
              certificate={winnerCertificate}
              timeTakenSeconds={timeTakenSeconds}
              lang={lang}
              onRetry={onRetryCertificate}
            />
          )}
        </div>

        {/* Learning recap: what each certificate needs and what the player matched or missed */}
        <div className="scorecard-recap">
          <h4 className="recap-heading">
            {isEn ? 'What each certificate needs' : 'हर प्रमाण पत्र के लिए क्या चाहिए'}
          </h4>
          <div className="recap-grid">
            {CERTIFICATES.map(cert => (
              <CertificateRecap
                key={cert.id}
                certificate={cert}
                collectedDocIds={collectedByCertificate[cert.id] || []}
                isUnlocked={unlockedCertificates.includes(cert.id)}
                lang={lang}
                onViewCertificate={onViewCertificate}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons: Next Participant vs Retry */}
        <div className="scorecard-actions-row">
          <button
            type="button"
            className="scorecard-btn-next"
            onClick={onNextParticipant}
          >
            <Icon as={Users} /> {isEn ? 'NEXT PARTICIPANT' : 'अगला प्रतिभागी'}
          </button>

          <button
            type="button"
            className="scorecard-btn-retry"
            onClick={onRetry}
          >
            <Icon as={RotateCcw} /> {isEn ? 'Try Again' : 'पुनः प्रयास करें'}
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
