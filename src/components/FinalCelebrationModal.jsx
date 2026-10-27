import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CERTIFICATES } from '../data/certificates';

export default function FinalCelebrationModal({
  score,
  lang = 'en',
  onViewCertificate,
  onRestart
}) {
  const isEn = lang === 'en';

  useEffect(() => {
    // Continuous firework bursts
    const end = Date.now() + 3 * 1000;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: { x: Math.random(), y: Math.random() - 0.2 }
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="modal-overlay active" role="dialog" aria-modal="true">
      <div
        className="cert-showcase-box"
        style={{
          maxWidth: '820px',
          textAlign: 'center',
          borderColor: '#ffaa00'
        }}
      >
        {/* Master Badge Emblem */}
        <div style={{ fontSize: '72px', margin: '0 auto 10px auto', animation: 'mascotFloat 3s infinite alternate' }}>
          👑
        </div>

        <h2 style={{ fontSize: 'clamp(28px, 3.8vw, 36px)', fontWeight: 950, color: '#78350f', letterSpacing: '0.5px' }}>
          {isEn ? 'YOU ARE A DOCUMENT MASTER!' : 'बधाई हो! आप बन गए हैं डॉक्यूमेंट मास्टर!'}
        </h2>

        <p style={{ fontSize: '17px', color: '#334155', margin: '10px 0 20px 0', lineHeight: 1.5, fontWeight: 600 }}>
          {isEn
            ? 'You have successfully unlocked all 4 government certificates by mastering their statutory prerequisite requirements!'
            : 'आपने छत्तीसगढ़ के चारों अनिवार्य प्रमाण पत्रों के नियम सीखकर सभी प्रमाण पत्र सफलतापूर्वक अनलॉक कर लिए हैं!'}
        </p>

        {/* Score Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fef3c7, #ffedd5)',
            border: '2.5px solid #f59e0b',
            borderRadius: '16px',
            padding: '16px 30px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '18px',
            marginBottom: '24px',
            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.25)'
          }}
        >
          <span style={{ fontSize: '36px' }}>🏆</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', textTransform: 'uppercase', color: '#b45309', fontWeight: 800 }}>
              {isEn ? 'Final Citizen Score' : 'अंतिम नागरिक स्कोर'}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 950, color: '#92400e', fontFamily: 'Chakra Petch, sans-serif' }}>
              {score} Points
            </div>
          </div>
        </div>

        {/* 4 Unlocked Certificates Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px',
            marginBottom: '26px'
          }}
        >
          {CERTIFICATES.map(cert => (
            <div
              key={cert.id}
              style={{
                background: '#f8fafc',
                border: '2px solid #cbd5e1',
                borderRadius: '14px',
                padding: '14px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
              }}
            >
              <span style={{ fontSize: '34px' }}>{cert.icon}</span>
              <span style={{ fontSize: '14.5px', fontWeight: 850, color: '#0b192c', textAlign: 'center', lineHeight: 1.25 }}>
                {isEn ? cert.name_en : cert.name_hi}
              </span>
              <span style={{ fontSize: '13px', color: '#059669', fontWeight: 800 }}>
                ✓ {isEn ? 'Unlocked' : 'अनलॉक'}
              </span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 800, marginTop: '4px', width: '100%' }}
                onClick={() => onViewCertificate(cert.id)}
              >
                {isEn ? 'View' : 'देखें'}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <a
            href="https://sevasetu.cg.gov.in"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ textDecoration: 'none', fontSize: '16px', padding: '13px 28px' }}
          >
            🌐 {isEn ? 'Explore Services on Seva Setu' : 'सेवा सेतु पोर्टल पर सेवाएं देखें'}
          </a>

          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '16px', padding: '13px 26px' }}
            onClick={onRestart}
          >
            🔄 {isEn ? 'Play Again (पुनः खेलें)' : 'पुनः खेलें'}
          </button>
        </div>
      </div>
    </div>
  );
}
