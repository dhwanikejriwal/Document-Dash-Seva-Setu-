import React from 'react';
import { Award, User, BadgeCheck, Printer, ArrowLeft } from 'lucide-react';
import { CERTIFICATES } from '../data/certificates';
import { DOCUMENTS } from '../data/documents';
import Icon from './Icon';
import './CertificateModal.css';

// The browser print dialog lets kiosk users reach the operating system, so printing is off.
// Turn it on only when the kiosk browser prints silently (e.g. Chrome with --kiosk-printing).
const PRINT_ENABLED = false;

export default function CertificateModal({
  certificateId,
  collectedDocIds = [],
  participantName = 'Citizen Participant',
  lang = 'en',
  onClose
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
          DOCUMENT DASH<br />
          PRACTICE CERTIFICATE<br />
          NOT VALID FOR OFFICIAL USE
        </div>

        {/* Certificate Header */}
        <div className="cert-header">
          <div className="cert-emblem"><Icon as={Award} /></div>
          <h2 className="cert-gov-title">
            {isEn ? 'DOCUMENT DASH • PRACTICE CERTIFICATE' : 'डॉक्यूमेंट डैश • अभ्यास प्रमाण पत्र'}
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
            <Icon as={cert.icon} /> {isEn ? cert.name_en.toUpperCase() : cert.name_hi}
          </div>
        </div>

        {/* Meta Grid */}
        <div className="cert-meta-grid">
          <div className="cert-meta-item">
            <strong>{isEn ? 'Applicant / आवेदक:' : 'आवेदक का नाम:'}</strong>
            <span className="cert-meta-applicant">
              <Icon as={User} /> {participantName}
            </span>
          </div>

          <div className="cert-meta-item">
            <strong>{isEn ? 'Certificate / App No:' : 'प्रमाण पत्र / आवेदन क्र:'}</strong>
            <span className="cert-meta-appno">
              {appNo}
            </span>
          </div>

          <div className="cert-meta-item">
            <strong>{isEn ? 'Issue Date / जारी दिनांक:' : 'जारी दिनांक:'}</strong>
            <span>{currentDate}</span>
          </div>

          <div className="cert-meta-item">
            <strong>{isEn ? 'Issued by:' : 'जारीकर्ता:'}</strong>
            <span className="cert-meta-portal">
              {isEn ? 'Document Dash' : 'डॉक्यूमेंट डैश'}
            </span>
          </div>
        </div>

        {/* Certificate Body Text */}
        <div className="cert-body-text">
          <p className="cert-body-lead">
            {isEn
              ? `This certifies that citizen applicant "${participantName}" has satisfied all statutory eligibility criteria. ${cert.statutoryClause_en}`
              : `प्रमाणित किया जाता है कि नागरिक आवेदक "${participantName}" ने सभी वैधानिक अर्हताएं पूर्ण की हैं। ${cert.statutoryClause_hi}`}
          </p>
          <div className="cert-verified-box">
            <strong>{isEn ? 'Verified Prerequisites Collected:' : 'सत्यापित संलग्न दस्तावेज़:'}</strong>
            <ul>
              {collectedDocObjects.map(d => (
                <li key={d.id}>
                  <Icon as={d.icon} /> {isEn ? d.title_en : d.title_hi} — <span className="cert-verified-tag">{isEn ? 'Verified' : 'सत्यापित'}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="cert-footer-row">
          <div className="cert-qr-box">
            <div className="cert-qr-code">
              DOCUMENT<br />
              DASH<br />
              PRACTICE
            </div>
            <div className="cert-qr-caption">
              {isEn ? 'Learning game certificate' : 'शैक्षिक खेल प्रमाण पत्र'}<br />
              <strong>{isEn ? 'Not an official document' : 'आधिकारिक दस्तावेज़ नहीं'}</strong>
            </div>
          </div>

          <div className="cert-sig-box">
            <div className="cert-sig-badge">
              <Icon as={BadgeCheck} /> {isEn ? 'Completed in Document Dash' : 'डॉक्यूमेंट डैश में पूर्ण'}
            </div>
            <div className="cert-sig-sub">
              {isEn ? 'For learning purposes only' : 'केवल सीखने के उद्देश्य से'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions-bar">
          {PRINT_ENABLED && (
            <button type="button" onClick={handlePrint} className="btn-secondary">
              <Icon as={Printer} /> {isEn ? 'Print Certificate' : 'प्रमाण पत्र प्रिंट करें'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ background: cert.gradient }}
          >
            <Icon as={ArrowLeft} /> {isEn ? 'Back to Score Card' : 'स्कोर कार्ड पर वापस'}
          </button>
        </div>
      </div>
    </div>
  );
}
