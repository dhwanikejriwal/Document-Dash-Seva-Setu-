import React from 'react';
import { CERTIFICATES } from '../data/certificates';
import { DOCUMENTS } from '../data/documents';

export default function CertificateModal({
  certificateId,
  collectedDocIds = [],
  participantName = 'Citizen Participant',
  lang = 'en',
  onClose,
  onContinue
}) {
  const cert = CERTIFICATES.find(c => c.id === certificateId);
  if (!cert) return null;

  const isEn = lang === 'en';
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const appNo = `${cert.sampleCodePrefix}-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  // List collected documents
  const collectedDocObjects = collectedDocIds.map(id =>
    DOCUMENTS.find(d => d.id === id)
  ).filter(Boolean);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay active" role="dialog" aria-modal="true">
      <div className="cert-showcase-box">
        {/* Prominent Watermark */}
        <div className="cert-watermark">
          GOVERNMENT OF CHHATTISGARH<br />
          छत्तीसगढ़ शासन<br />
          DEMO CERTIFICATE — NOT VALID FOR OFFICIAL USE
        </div>

        {/* Certificate Header */}
        <div className="cert-header">
          <div className="cert-emblem">🏛️</div>
          <h2 className="cert-gov-title">
            छत्तीसगढ़ शासन • GOVERNMENT OF CHHATTISGARH
          </h2>
          <div className="cert-gov-sub">
            {isEn ? cert.authority_en : cert.authority_hi}
          </div>
          <div
            className="cert-name-banner"
            style={{
              borderColor: cert.color,
              color: cert.color
            }}
          >
            {cert.icon} {isEn ? cert.name_en.toUpperCase() : cert.name_hi}
          </div>
        </div>

        {/* Meta Grid */}
        <div className="cert-meta-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="cert-meta-item">
            <strong>{isEn ? 'Applicant / आवेदक:' : 'आवेदक का नाम:'}</strong>
            <span style={{ fontWeight: 800, color: '#1e293b' }}>
              👤 {participantName}
            </span>
          </div>

          <div className="cert-meta-item">
            <strong>{isEn ? 'Certificate / App No:' : 'प्रमाण पत्र / आवेदन क्र:'}</strong>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#b45309' }}>
              {appNo}
            </span>
          </div>

          <div className="cert-meta-item">
            <strong>{isEn ? 'Issue Date / जारी दिनांक:' : 'जारी दिनांक:'}</strong>
            <span>{currentDate}</span>
          </div>

          <div className="cert-meta-item">
            <strong>{isEn ? 'Verification Portal:' : 'सत्यापन पोर्टल:'}</strong>
            <span style={{ color: '#0077ff', fontWeight: 600 }}>
              Seva Setu (CHiPS)
            </span>
          </div>
        </div>

        {/* Certificate Body Text */}
        <div className="cert-body-text">
          <p style={{ marginBottom: '8px' }}>
            {isEn
              ? `This certifies that citizen applicant "${participantName}" has satisfied all statutory eligibility criteria. ${cert.statutoryClause_en}`
              : `प्रमाणित किया जाता है कि नागरिक आवेदक "${participantName}" ने सभी वैधानिक अर्हताएं पूर्ण की हैं। ${cert.statutoryClause_hi}`}
          </p>
          <div style={{ background: '#f1f5f9', padding: '8px 12px', borderRadius: '6px', fontSize: '12px' }}>
            <strong>{isEn ? 'Verified Prerequisites Collected:' : 'सत्यापित संलग्न दस्तावेज़:'}</strong>
            <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
              {collectedDocObjects.map(d => (
                <li key={d.id}>
                  {d.icon} {isEn ? d.title_en : d.title_hi} — <span style={{ color: '#059669', fontWeight: 600 }}>{isEn ? 'Verified' : 'सत्यापित'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="cert-footer-row">
          <div className="cert-qr-box">
            <div className="cert-qr-code">
              SEVA SETU<br />
              VERIFIED<br />
              QR CODE
            </div>
            <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>
              Digitally verifiable on<br />
              <strong>sevasetu.cg.gov.in</strong>
            </div>
          </div>

          <div className="cert-sig-box">
            <div className="cert-sig-badge">
              <span>✅</span> {isEn ? 'Digitally Signed by Authorized Officer' : 'अधिकृत अधिकारी द्वारा डिजिटल हस्ताक्षरित'}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
              e-District Portal • Government of Chhattisgarh
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions-bar">
          <button type="button" onClick={handlePrint} className="btn-secondary">
            🖨️ {isEn ? 'Print / Save as PDF' : 'प्रिंट / सेव करें'}
          </button>
          <button type="button" onClick={onClose} className="btn-secondary">
            {isEn ? 'Close' : 'बंद करें'}
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="btn-primary"
            style={{ background: cert.gradient }}
          >
            🎮 {isEn ? 'Continue Document Quest' : 'क्वेस्ट जारी रखें'}
          </button>
        </div>
      </div>
    </div>
  );
}
