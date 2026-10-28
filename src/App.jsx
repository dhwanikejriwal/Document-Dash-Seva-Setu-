import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from './audio';
import { CERTIFICATES, acceptsDocument, isCertificateComplete } from './data/certificates';
import { DOCUMENTS } from './data/documents';
import './App.css';

import ThreeCanvas from './components/ThreeCanvas';
import WelcomeScreen from './components/WelcomeScreen';
import GameHUD from './components/GameHUD';
import CertificateBucket from './components/CertificateBucket';
import FloatingDocumentDeck from './components/FloatingDocumentDeck';
import CertificateModal from './components/CertificateModal';
import ResultScoreCardModal from './components/ResultScoreCardModal';
import HelpTutorialModal from './components/HelpTutorialModal';
import ScreenSaver from './components/ScreenSaver';
import {
  CertificateUnlockAnimation,
  TimeUpAnimation,
  ComboBurstBanner,
  MismatchAlert
} from './components/ArcadeAnimations';

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
  const [gameState, setGameState] = useState('welcome'); // 'welcome' | 'playing' | 'scorecard' | 'screensaver'
  const [participantName, setParticipantName] = useState('');
  const [lang, setLang] = useState('en');
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // 45-Second Arcade Timer
  const [timeLeft, setTimeLeft] = useState(45);
  const timerRef = useRef(null);

  // Arcade Animations States (Like 1-2-3 Countdown)
  const [unlockAnimCert, setUnlockAnimCert] = useState(null);
  const [isTimeUpAnimActive, setIsTimeUpAnimActive] = useState(false);
  const [activeComboBurst, setActiveComboBurst] = useState(null);
  const [mismatchAlert, setMismatchAlert] = useState(null);

  // Gameplay Scoring & Accuracy Stats
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [highestCombo, setHighestCombo] = useState(1);
  const [correctSortsCount, setCorrectSortsCount] = useState(0);
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

  // Modals state
  const [activeModal, setActiveModal] = useState('none'); // 'none' | 'certificate' | 'help'
  const [previewCertId, setPreviewCertId] = useState('domicile');

  // 45-Second Timer Countdown (Pauses while modals are open)
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

  // Idle Attract Mode / Screensaver Timer (Triggers after 25s of inactivity on Welcome screen)
  useEffect(() => {
    if (gameState !== 'welcome') return;

    let idleTimer;
    const resetIdle = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setGameState('screensaver');
      }, 25000); // 25s idle threshold
    };

    resetIdle();
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle);

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
    };
  }, [gameState]);

  const handleTimeExpired = () => {
    sound.playTimeUp();
    setIsTimeUpAnimActive(true);
  };

  const handleStartGame = (name) => {
    setParticipantName(name);
    setScore(0);
    setCombo(1);
    setHighestCombo(1);
    setCorrectSortsCount(0);
    setTimeLeft(45);
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
    sound.playPickup();
    setGameState('welcome');
    setParticipantName('');
    setScore(0);
    setUnlockedCertificates([]);
    setCollectedByCertificate({
      domicile: [],
      caste: [],
      income: [],
      marriage: []
    });
    setTimeLeft(45);
    setUnlockAnimCert(null);
    setIsTimeUpAnimActive(false);
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
      if (newCombo > highestCombo) setHighestCombo(newCombo);
      setCorrectSortsCount(prev => prev + 1);

      const points = 150 * combo;
      setScore(prev => prev + points);

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

        sound.playFanfare();
        sound.playUnlock();

        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.45 }
        });

        // Trigger Full-Screen Arcade Trophy Animation (like 1-2-3 countdown)
        setUnlockAnimCert(cert);
      }
    } else {
      // INCORRECT!
      sound.playError();
      setCombo(1); // reset streak

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
      <ThreeCanvas isScreensaver={gameState === 'screensaver'} />

      {/* Screen 0: Interactive Arcade Screensaver / Attract Mode */}
      {gameState === 'screensaver' && (
        <ScreenSaver
          onWakeUp={() => setGameState('welcome')}
          lang={lang}
        />
      )}

      {/* Screen 1: Welcome & Participant Registration */}
      {gameState === 'welcome' && (
        <WelcomeScreen
          lang={lang}
          onStartGame={handleStartGame}
          onToggleLang={handleToggleLang}
          isAudioMuted={isAudioMuted}
          onToggleAudio={handleToggleAudio}
          onTriggerScreensaver={() => setGameState('screensaver')}
        />
      )}

      {/* Screen 2: Active 45s Game Play Overlay (Clean & Uncluttered!) */}
      {gameState === 'playing' && (
        <main id="app-overlay">
          {/* Top HUD with 45s Timer & Participant Badge */}
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
                onBucketClick={handleBucketClick}
                onViewCertificate={handleViewCertificate}
              />
            ))}
          </section>
        </main>
      )}

      {/* Screen 3: Official Participant Score Card */}
      {gameState === 'scorecard' && (
        <ResultScoreCardModal
          participantName={participantName}
          score={score}
          unlockedCertificates={unlockedCertificates}
          correctSortsCount={correctSortsCount}
          highestCombo={highestCombo}
          timeExpired={timeLeft === 0}
          lang={lang}
          onViewCertificate={handleViewCertificate}
          onNextParticipant={handleNextParticipant}
          onRetry={handleRetrySameParticipant}
        />
      )}

      {/* ========================================================
          FULL-SCREEN & IN-GAME ARCADE ANIMATIONS
          ======================================================== */}

      {/* 1. Full-Screen Certificate Unlocked Trophy Slam Animation (Like 1-2-3 countdown) */}
      {unlockAnimCert && (
        <CertificateUnlockAnimation
          certificate={unlockAnimCert}
          lang={lang}
          onFinish={() => {
            const certId = unlockAnimCert.id;
            setUnlockAnimCert(null);
            if (unlockedCertificates.length === 4) {
              clearInterval(timerRef.current);
              setGameState('scorecard');
            } else {
              setPreviewCertId(certId);
              setActiveModal('certificate');
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
          onContinue={() => setActiveModal('none')}
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
