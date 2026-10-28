import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Star, Trophy, Info } from 'lucide-react';
import { mandatoryRequirements, metRequirementCount } from '../data/certificates';
import Icon from './Icon';
import RequirementsHint from './RequirementsHint';
import './CertificateBucket.css';

export default function CertificateBucket({
  certificate,
  collectedDocIds = [],
  isUnlocked = false,
  hasSelectedDoc = false,
  lang = 'en',
  onDropDoc,
  onBucketClick
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const isEn = lang === 'en';

  // Required-documents hint: shows on mouse hover, or stays pinned after a click/tap
  // (only when no document is selected, since then a click drops the document here).
  const wrapperRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isHintPinned, setIsHintPinned] = useState(false);
  const showHint = (isHovered || isHintPinned) && !isDragOver;

  useEffect(() => {
    if (!isHintPinned) return;
    const closeOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setIsHintPinned(false);
    };
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') setIsHintPinned(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isHintPinned]);

  const handleClick = () => {
    if (hasSelectedDoc) onBucketClick(certificate.id);
    else setIsHintPinned(pinned => !pinned);
  };

  // Progress counts document types satisfied, not documents dropped
  const totalMandatory = mandatoryRequirements(certificate).length;
  const collectedMandatoryCount = metRequirementCount(certificate, collectedDocIds);

  const percentage = Math.round((collectedMandatoryCount / totalMandatory) * 100);

  // Trigger bounce effect whenever a new document is added
  useEffect(() => {
    if (collectedDocIds.length > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 600);
      return () => clearTimeout(timer);
    }
  }, [collectedDocIds.length]);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const docId = e.dataTransfer.getData('text/plain');
    if (docId) {
      onDropDoc(docId, certificate.id);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`gamified-bucket-wrapper ${isBouncing ? 'bucket-bounce-active' : ''} ${isUnlocked ? 'bucket-is-unlocked' : ''}`}
      onClick={handleClick}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setIsHovered(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setIsHovered(false)}
      data-bucket-id={certificate.id}
    >
      {showHint && (
        <RequirementsHint certificate={certificate} collectedDocIds={collectedDocIds} lang={lang} />
      )}

      {/* 3D Basket Metallic / Energy Handle */}
      <div
        className="basket-handle"
        style={{
          borderColor: isUnlocked ? 'var(--color-unlocked)' : certificate.solid,
          boxShadow: isUnlocked
            ? '0 0 24px rgba(var(--color-unlocked-rgb), 0.7)'
            : `0 0 14px ${certificate.glowColor}`
        }}
      >
        <span
          className="basket-handle-grip"
          style={{ background: isUnlocked ? 'linear-gradient(90deg, var(--gold-300), var(--saffron-400))' : certificate.solid }}
        />
      </div>

      {/* Main 3D Basket Container */}
      <div
        className={`gamified-basket-container ${isDragOver ? 'drag-over' : ''} ${isUnlocked ? 'basket-unlocked' : ''}`}
        style={{
          '--basket-glow': certificate.color,
          '--basket-solid': certificate.solid
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Basket Rim: progress count or drop prompt */}
        <div className="basket-rim">
          <div className="basket-rim-opening">
            {isDragOver ? (
              <span className="rim-drop-hint">
                <Icon as={Sparkles} /> {isEn ? 'Drop Here!' : 'यहाँ छोड़ें!'}
              </span>
            ) : isUnlocked ? (
              <span className="rim-status-hint unlocked-glow">
                <Icon as={Star} /> {isEn ? 'UNLOCKED' : 'अनलॉक'}
              </span>
            ) : (
              <span className="rim-status-hint">
                {collectedMandatoryCount}/{totalMandatory}
              </span>
            )}
          </div>
        </div>

        {/* Basket Body Content */}
        <div className="basket-body">
          {/* Header & Icon */}
          <div className="basket-header-info">
            <div className="basket-badge-icon">
              <Icon as={certificate.icon} />
            </div>
            <div className="basket-titles">
              <h3 className="basket-cert-title">
                {isEn ? certificate.name_en : certificate.name_hi}
              </h3>
              <span
                className={`basket-hint-cue ${showHint ? 'is-active' : ''}`}
                title={isEn ? 'Hover or tap to see the documents required' : 'आवश्यक दस्तावेज़ देखने के लिए होवर या टैप करें'}
              >
                <Icon as={Info} />
              </span>
            </div>
          </div>

          {/* Liquid / Energy Fill Gauge Inside the Basket */}
          <div className="basket-interior-gauge">
            <div
              className="basket-liquid-fill"
              style={{ height: `${Math.max(percentage, 10)}%` }}
            >
              <div className="basket-liquid-surface" />
            </div>

            {/* Ready Prompt (Only when unlocked) */}
            {isUnlocked && (
              <div className="gauge-overlay-text">
                <div className="unlocked-burst-prompt">
                  <Icon as={Trophy} />
                  <strong>{isEn ? 'READY!' : 'तैयार!'}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Basket Footer Progress & Percentage */}
          <div className="basket-footer-stats">
            <div className="basket-progress-track">
              <div className="basket-progress-bar-fill" style={{ width: `${percentage}%` }} />
            </div>

            <div className="basket-percentage-pill">
              <strong>{percentage}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
