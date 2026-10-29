import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from './audio';
import { CERTIFICATES, acceptsDocument, isCertificateComplete } from './data/certificates';
import { DOCUMENTS } from './data/documents';
import { requestCertificate } from './api/certificate';
import { LAUNCHER_URL } from './config';
import './App.css';

import ThreeCanvas from './components/ThreeCanvas';
import WelcomeScreen from './components/WelcomeScreen';
import GameHUD from './components/GameHUD';
import CertificateBucket from './components/CertificateBucket';
import FloatingDocumentDeck from './components/FloatingDocumentDeck';
import CertificateModal from './components/CertificateModal';
import ResultScoreCardModal from './components/ResultScoreCardModal';
import HelpTutorialModal from './components/HelpTutorialModal';
import {
  CertificateUnlockNotice,
  TimeUpAnimation,
  ComboBurstBanner,
  MismatchAlert
} from './components/ArcadeAnimations';

// Length of one race, in seconds
const RACE_SECONDS = 60;

// Kiosk: with no touch for this long mid-round or on the score card, the participant
// (whose name is on screen) is cleared and the kiosk returns to the start screen, or to the
// game selection screen when LAUNCHER_URL is set.
const KIOSK_IDLE_SECONDS = 60;
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'touchstart'];

// Fisher–Yates shuffle, so the deck never groups documents by certificate.
const shuffle = (items) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export default function App() {
  const [gameState, setGameState] = useState('welcome'); // 'welcome' | 'playing' | 'scorecard'
  const [participantName, setParticipantName] = useState('');
  const [lang, setLang] = useState('en');
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Race Timer
  const [timeLeft, setTimeLeft] = useState(RACE_SECONDS);
  const timerRef = useRef(null);

  // Arcade Animations States (Like 1-2-3 Countdown)
  const [unlockAnimCert, setUnlockAnimCert] = useState(null);
  const [isTimeUpAnimActive, setIsTimeUpAnimActive] = useState(false);
  const [activeComboBurst, setActiveComboBurst] = useState(null);
  const [mismatchAlert, setMismatchAlert] = useState(null);

  // Match streak (for the in-game combo banner) and accuracy for the score card recap
  const [combo, setCombo] = useState(1);
  const [correctSortsCount, setCorrectSortsCount] = useState(0);
  const [wrongSortsCount, setWrongSortsCount] = useState(0);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [deck, setDeck] = useState(() => shuffle(DOCUMENTS));

  // Collected document IDs mapped by certificate ID
  const [collectedByCertificate, setCollectedByCertificate] = useState({
    domicile: [],
    caste: [],
    income: [],
    marriage: []
  });

  // Array of certificate IDs that are 100% unlocked
  const [unlockedCertificates, setUnlockedCertificates] = useState([]);

  // Winner's certificate from the certificate service:
  // { status: 'idle' | 'loading' | 'ready' | 'error', qrCode?, certificateUrl? }
  const [winnerCertificate, setWinnerCertificate] = useState({ status: 'idle' });
  const [winSeconds, setWinSeconds] = useState(0);
  // Bumped every round, so a late certificate response can't land on the next player's screen
  const roundRef = useRef(0);

  // Modals state
  const [activeModal, setActiveModal] = useState('none'); // 'none' | 'certificate' | 'help'
  const [previewCertId, setPreviewCertId] = useState('domicile');

  // Race Timer Countdown (Pauses while modals are open)
  useEffect(() => {
    if (gameState === 'playing' && activeModal === 'none') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeExpired();
            return 0;
          }
          if (prev <= 10) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, activeModal]);

  // Kiosk watchdog for an abandoned round or score card (see KIOSK_IDLE_SECONDS)
  const [idleSecondsLeft, setIdleSecondsLeft] = useState(KIOSK_IDLE_SECONDS);
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'scorecard') return;

    const resetWatchdog = () => setIdleSecondsLeft(KIOSK_IDLE_SECONDS);
    resetWatchdog();
    const tick = setInterval(() => setIdleSecondsLeft(s => s - 1), 1000);
    ACTIVITY_EVENTS.forEach(ev => window.addEventListener(ev, resetWatchdog));

    return () => {
      clearInterval(tick);
      ACTIVITY_EVENTS.forEach(ev => window.removeEventListener(ev, resetWatchdog));
    };
  }, [gameState]);

  useEffect(() => {
    if (idleSecondsLeft <= 0 && (gameState === 'playing' || gameState === 'scorecard')) {
      handleNextParticipant();
    }
  }, [idleSecondsLeft]);

  // With a game selection screen, an idle start screen hands the kiosk back to it
  useEffect(() => {
    if (gameState !== 'welcome' || !LAUNCHER_URL) return;

    let idleTimer;
    const restartIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => window.location.assign(LAUNCHER_URL), KIOSK_IDLE_SECONDS * 1000);
    };
    restartIdle();
    ACTIVITY_EVENTS.forEach(ev => window.addEventListener(ev, restartIdle));

    return () => {
      clearTimeout(idleTimer);
      ACTIVITY_EVENTS.forEach(ev => window.removeEventListener(ev, restartIdle));
    };
  }, [gameState]);

  // Kiosk: a long press must not open the browser's context menu
  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    window.addEventListener('contextmenu', blockContextMenu);
    return () => window.removeEventListener('contextmenu', blockContextMenu);
  }, []);

  const handleTimeExpired = () => {
    sound.playTimeUp();
    setIsTimeUpAnimActive(true);
  };

  // Asks the certificate service for the winner's certificate. Runs once per won game, plus
  // again only from Retry, because every call creates a new certificate on the server.
  const requestWinnerCertificate = (username, timeTakenSeconds) => {
    const round = roundRef.current;
    setWinnerCertificate({ status: 'loading' });
    requestCertificate({ username, timeTakenSeconds })
      .then(data => {
        if (roundRef.current === round) setWinnerCertificate({ status: 'ready', ...data });
      })
      .catch(() => {
        if (roundRef.current === round) setWinnerCertificate({ status: 'error' });
      });
  };

  const handleStartGame = (name) => {
    roundRef.current += 1;
    setWinnerCertificate({ status: 'idle' });
    setWinSeconds(0);
    setParticipantName(name);
    setCombo(1);
    setCorrectSortsCount(0);
    setWrongSortsCount(0);
    setTimeLeft(RACE_SECONDS);
    setCollectedByCertificate({
      domicile: [],
      caste: [],
      income: [],
      marriage: []
    });
    setUnlockedCertificates([]);
    setSelectedDocId(null);
    setDeck(shuffle(DOCUMENTS));
    setActiveModal('none');
    setUnlockAnimCert(null);
    setIsTimeUpAnimActive(false);
    setActiveComboBurst(null);
    setMismatchAlert(null);
    setGameState('playing');
  };

  const handleNextParticipant = () => {
    // Launched from the game selection screen: hand the kiosk back to it
    if (LAUNCHER_URL) {
      window.location.assign(LAUNCHER_URL);
      return;
    }

    sound.playPickup();
    roundRef.current += 1;
    setWinnerCertificate({ status: 'idle' });
    setGameState('welcome');
    setParticipantName('');
    setUnlockedCertificates([]);
    setCollectedByCertificate({
      domicile: [],
      caste: [],
      income: [],
      marriage: []
    });
    setTimeLeft(RACE_SECONDS);
    setSelectedDocId(null);
    setActiveModal('none');
    setUnlockAnimCert(null);
    setIsTimeUpAnimActive(false);
    setActiveComboBurst(null);
    setMismatchAlert(null);
  };

  const handleRetrySameParticipant = () => {
    handleStartGame(participantName);
  };

  const handleToggleLang = () => {
    sound.playPickup();
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleToggleAudio = () => {
    const muted = sound.toggleMute();
    setIsAudioMuted(muted);
  };

  // Main Drag / Drop and Click-Assign handler
  const handleDropDoc = (docId, bucketId) => {
    if (gameState !== 'playing') return;

    const doc = DOCUMENTS.find(d => d.id === docId);
    const cert = CERTIFICATES.find(c => c.id === bucketId);
    if (!doc || !cert) return;

    sound.playDrop();

    // 1. Check if already collected for this specific certificate
    const alreadyCollected = collectedByCertificate[bucketId]?.includes(docId);
    if (alreadyCollected) {
      sound.playError();
      setMismatchAlert({
        text: lang === 'en' ? 'ALREADY SLOTTED!' : 'पहले से जमा!'
      });
      setSelectedDocId(null);
      return;
    }

    // 2. Validate: the document must support one of this certificate's document types
    const isValid = acceptsDocument(cert, docId);

    if (isValid) {
      // SUCCESS!
      sound.playSuccess();
      const newCombo = combo + 1;
      setCombo(newCombo);
      setCorrectSortsCount(prev => prev + 1);

      const points = 150 * combo;

      // Trigger floating arcade combo burst
      setActiveComboBurst({
        combo: newCombo,
        points,
        text: newCombo > 1 ? `COMBO x${newCombo}!` : (lang === 'en' ? 'MATCH!' : 'सफल!')
      });

      // Mini confetti
      confetti({
        particleCount: 25,
        spread: 55,
        origin: { y: 0.65 }
      });

      // Update state
      const updatedList = [...(collectedByCertificate[bucketId] || []), docId];
      setCollectedByCertificate(prev => ({
        ...prev,
        [bucketId]: updatedList
      }));

      // Unlock once every mandatory document type has at least one supporting document
      const allMandatoryMet = isCertificateComplete(cert, updatedList);
      if (allMandatoryMet && !unlockedCertificates.includes(bucketId)) {
        const nextUnlocked = [...unlockedCertificates, bucketId];
        setUnlockedCertificates(nextUnlocked);

        // All four done: stop the clock now, so the closing celebration can't run it out, and
        // request the winner's certificate while the celebration plays
        if (nextUnlocked.length === CERTIFICATES.length) {
          clearInterval(timerRef.current);
          const timeTakenSeconds = RACE_SECONDS - timeLeft;
          setWinSeconds(timeTakenSeconds);
          requestWinnerCertificate(participantName, timeTakenSeconds);
        }

        sound.playFanfare();
        sound.playUnlock();

        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.45 }
        });

        // Non-blocking "certificate complete" notice; play continues underneath
        setUnlockAnimCert(cert);
      }
    } else {
      // INCORRECT!
      sound.playError();
      setCombo(1); // reset streak
      setWrongSortsCount(prev => prev + 1);

      // Trigger arcade mismatch slam
      setMismatchAlert({
        text: lang === 'en' ? 'WRONG BUCKET!' : 'गलत बास्केट!'
      });
    }

    setSelectedDocId(null);
  };

  const handleBucketClick = (bucketId) => {
    if (selectedDocId) {
      handleDropDoc(selectedDocId, bucketId);
    }
  };

  const handleViewCertificate = (bucketId) => {
    sound.playPickup();
    setPreviewCertId(bucketId);
    setActiveModal('certificate');
  };

  return (
    <div
      className="app-root"
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}
    >
      {/* 3D Three.js Background Canvas */}
      <ThreeCanvas />

      {/* Screen 1: Welcome & Participant Registration */}
      {gameState === 'welcome' && (
        <WelcomeScreen
          lang={lang}
          onStartGame={handleStartGame}
          onToggleLang={handleToggleLang}
          isAudioMuted={isAudioMuted}
          onToggleAudio={handleToggleAudio}
        />
      )}

      {/* Screen 2: Active Game Play Overlay (Clean & Uncluttered!) */}
      {gameState === 'playing' && (
        <main id="app-overlay">
          {/* Top HUD with Race Timer & Participant Badge */}
          <GameHUD
            participantName={participantName}
            timeLeft={timeLeft}
            unlockedCount={unlockedCertificates.length}
            totalCertificates={CERTIFICATES.length}
            lang={lang}
            onToggleLang={handleToggleLang}
            isAudioMuted={isAudioMuted}
            onToggleAudio={handleToggleAudio}
            onOpenHelp={() => setActiveModal('help')}
            onEndGameEarly={() => handleTimeExpired()}
          />

          {/* Area A: Floating Prerequisite Document Boxes (At Top) */}
          <FloatingDocumentDeck
            documents={deck}
            collectedByCertificate={collectedByCertificate}
            selectedDocId={selectedDocId}
            lang={lang}
            onSelectDoc={(docId) => setSelectedDocId(docId)}
            onDragStartDoc={(docId) => {
              sound.playPickup();
              setSelectedDocId(docId);
            }}
            onDropDoc={handleDropDoc}
          />

          {/* Area B: 4 Gamified Certificate Baskets (At Bottom) */}
          <section className="baskets-stage-row">
            {CERTIFICATES.map(cert => (
              <CertificateBucket
                key={cert.id}
                certificate={cert}
                collectedDocIds={collectedByCertificate[cert.id] || []}
                isUnlocked={unlockedCertificates.includes(cert.id)}
                lang={lang}
                onDropDoc={handleDropDoc}
                hasSelectedDoc={!!selectedDocId}
                onBucketClick={handleBucketClick}
              />
            ))}
          </section>
        </main>
      )}

      {/* Screen 3: Official Participant Score Card */}
      {gameState === 'scorecard' && (
        <ResultScoreCardModal
          participantName={participantName}
          unlockedCertificates={unlockedCertificates}
          collectedByCertificate={collectedByCertificate}
          correctSortsCount={correctSortsCount}
          wrongSortsCount={wrongSortsCount}
          winnerCertificate={winnerCertificate}
          timeTakenSeconds={winSeconds}
          onRetryCertificate={() => requestWinnerCertificate(participantName, winSeconds)}
          timeExpired={timeLeft === 0}
          lang={lang}
          onViewCertificate={handleViewCertificate}
          idleSecondsLeft={idleSecondsLeft}
          onNextParticipant={handleNextParticipant}
          onRetry={handleRetrySameParticipant}
        />
      )}

      {/* ========================================================
          FULL-SCREEN & IN-GAME ARCADE ANIMATIONS
          ======================================================== */}

      {/* 1. Certificate complete: small notice that doesn't block play */}
      {unlockAnimCert && (
        <CertificateUnlockNotice
          certificate={unlockAnimCert}
          lang={lang}
          onFinish={() => {
            // Celebrate and keep racing; certificates are shown on the score card at the end
            setUnlockAnimCert(null);
            if (unlockedCertificates.length === CERTIFICATES.length) {
              clearInterval(timerRef.current);
              setGameState('scorecard');
            }
          }}
        />
      )}

      {/* 2. Full-Screen TIME'S UP! Dramatic Animation (Like 1-2-3 countdown) */}
      {isTimeUpAnimActive && (
        <TimeUpAnimation
          lang={lang}
          onFinish={() => {
            setIsTimeUpAnimActive(false);
            setGameState('scorecard');
          }}
        />
      )}

      {/* 3. Floating Arcade Combo & Match Explosions */}
      <ComboBurstBanner
        comboData={activeComboBurst}
        onDismiss={() => setActiveComboBurst(null)}
      />

      {/* 4. Arcade Wrong Bucket / Mismatch Animation */}
      <MismatchAlert
        alertData={mismatchAlert}
        onDismiss={() => setMismatchAlert(null)}
      />

      {/* Certificate Modal */}
      {activeModal === 'certificate' && (
        <CertificateModal
          certificateId={previewCertId}
          collectedDocIds={collectedByCertificate[previewCertId] || []}
          participantName={participantName}
          lang={lang}
          onClose={() => setActiveModal('none')}
        />
      )}

      {/* Help / Rules Tutorial Modal */}
      {activeModal === 'help' && (
        <HelpTutorialModal
          lang={lang}
          onClose={() => setActiveModal('none')}
        />
      )}
    </div>
  );
}
