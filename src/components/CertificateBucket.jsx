import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Trophy, ScrollText } from 'lucide-react';
import { mandatoryRequirements, metRequirementCount } from '../data/certificates';
import Icon from './Icon';
import './CertificateBucket.css';

export default function CertificateBucket({
  certificate,
  collectedDocIds = [],
  isUnlocked = false,
  lang = 'en',
  onDropDoc,
  onBucketClick,
  onViewCertificate
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const isEn = lang === 'en';

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
      className={`gamified-bucket-wrapper ${isBouncing ? 'bucket-bounce-active' : ''} ${isUnlocked ? 'bucket-is-unlocked' : ''}`}
      onClick={() => onBucketClick(certificate.id)}
      data-bucket-id={certificate.id}
    >
      {/* 3D Basket Metallic / Energy Handle */}
      <div
        className="basket-handle"
        style={{
          borderColor: isUnlocked ? 'var(--color-unlocked)' : certificate.color,
          boxShadow: isUnlocked
            ? '0 0 24px rgba(var(--color-unlocked-rgb), 0.7)'
            : `0 0 14px ${certificate.glowColor}`
        }}
      >
        <span
          className="basket-handle-grip"
          style={{ background: isUnlocked ? 'linear-gradient(90deg, var(--gold-300), var(--saffron-400))' : certificate.color }}
        />
      </div>

      {/* Main 3D Basket Container */}
      <div
        className={`gamified-basket-container ${isDragOver ? 'drag-over' : ''} ${isUnlocked ? 'basket-unlocked' : ''}`}
        style={{
          '--basket-glow': certificate.color,
          '--basket-gradient': certificate.gradient
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Basket Oval Rim Glow */}
        <div className="basket-rim">
          <div
            className="basket-rim-glow"
            style={{ background: isUnlocked ? 'var(--color-unlocked)' : certificate.color }}
          />
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
            <div
              className="basket-badge-icon"
              style={{
                borderColor: isUnlocked ? 'var(--color-unlocked)' : certificate.color,
                background: isUnlocked ? 'rgba(var(--color-unlocked-rgb), 0.2)' : 'rgba(var(--black-rgb), 0.4)'
              }}
            >
              <Icon as={certificate.icon} />
            </div>
            <div className="basket-titles">
              <h3 className="basket-cert-title" style={{ color: isUnlocked ? 'var(--color-unlocked)' : 'var(--color-text)' }}>
                {isEn ? certificate.name_en : certificate.name_hi}
              </h3>
            </div>
          </div>

          {/* Liquid / Energy Fill Gauge Inside the Basket */}
          <div className="basket-interior-gauge">
            <div
              className="basket-liquid-fill"
              style={{
                height: `${Math.max(percentage, 10)}%`,
                background: isUnlocked
                  ? 'linear-gradient(180deg, var(--gold-300), var(--saffron-400))'
                  : certificate.gradient
              }}
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
              <div
                className="basket-progress-bar-fill"
                style={{
                  width: `${percentage}%`,
                  background: isUnlocked
                    ? 'linear-gradient(90deg, var(--gold-300), var(--gold-500))'
                    : certificate.gradient
                }}
              />
            </div>

            <div
              className="basket-percentage-pill"
              style={{ color: isUnlocked ? 'var(--color-unlocked)' : certificate.color }}
            >
              <strong>{percentage}%</strong>
            </div>
          </div>

          {/* Glowing View Certificate Button (Appears when unlocked) */}
          {isUnlocked && (
            <button
              type="button"
              className="basket-unlocked-btn"
              onClick={(e) => {
                e.stopPropagation();
                onViewCertificate(certificate.id);
              }}
            >
              <Icon as={ScrollText} /> {isEn ? 'VIEW CERTIFICATE' : 'प्रमाण पत्र देखें'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
