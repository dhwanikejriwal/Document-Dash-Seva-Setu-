import React from 'react';
import { CERTIFICATES } from '../data/certificates';

export default function HelpTutorialModal({ lang = 'en', onClose }) {
  const isEn = lang === 'en';

  return (
    <div className="modal-overlay active" role="dialog" aria-modal="true">
      <div className="cert-showcase-box" style={{ maxWidth: '720px' }}>
        <div className="cert-header">
          <h2 className="cert-gov-title">
            {isEn ? '📋 Seva Setu Certificate Prerequisite Guide' : '📋 सेवा सेतु प्रमाण पत्र नियम मार्गदर्शिका'}
          </h2>
          <div className="cert-gov-sub">
            {isEn
              ? 'Government of Chhattisgarh Official Citizen Guidelines'
              : 'छत्तीसगढ़ शासन के आधिकारिक नागरिक सेवा नियम'}
          </div>
        </div>

        <div style={{ fontSize: '15.5px', lineHeight: 1.6, color: '#1e293b', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontWeight: 600 }}>
            {isEn
              ? 'In Document Quest, you learn which documents belong to each of the 4 statutory certificates in Chhattisgarh:'
              : 'डॉक्यूमेंट क्वेस्ट में आप सीखते हैं कि छत्तीसगढ़ के ४ प्रमुख प्रमाण पत्रों के लिए कौन-से दस्तावेज़ अनिवार्य हैं:'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {CERTIFICATES.map(c => (
              <div
                key={c.id}
                style={{
                  background: '#f8fafc',
                  border: `2px solid ${c.color}`,
                  borderRadius: '12px',
                  padding: '12px 14px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ fontWeight: 850, fontSize: '16px', color: c.color, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{c.icon}</span>
                  <span>{isEn ? c.name_en : c.name_hi}</span>
                </div>
                <div style={{ fontSize: '13.5px', color: '#475569', marginTop: '6px', fontWeight: 600 }}>
                  {isEn ? c.subtitle_en : c.subtitle_hi}
                </div>
                <div style={{ fontSize: '13px', color: '#0b192c', marginTop: '6px', fontWeight: 750 }}>
                  {isEn ? `${c.mandatoryDocIds.length} Mandatory Prerequisites` : `${c.mandatoryDocIds.length} अनिवार्य दस्तावेज़ आवश्यक`}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#fef3c7', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #f59e0b', fontSize: '14px', color: '#78350f' }}>
            <strong style={{ fontSize: '14.5px' }}>💡 {isEn ? 'Pro Citizen Tips:' : 'नागरिक सुझाव:'}</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px', lineHeight: 1.5 }}>
              <li>
                {isEn
                  ? 'Multi-Purpose Proofs: Aadhaar and Ration Cards can satisfy prerequisites across multiple certificates!'
                  : 'बहु-उद्देशीय दस्तावेज़: आधार और राशन कार्ड एक से अधिक प्रमाण पत्रों में मान्य होते हैं!'}
              </li>
              <li>
                {isEn
                  ? 'Watch out for private commercial receipts (gym, movie tickets) which are invalid distractors.'
                  : 'निजी व्यावसायिक रसीदें (जिम, मूवी टिकट) सरकारी प्रमाण पत्र हेतु अमान्य हैं।'}
              </li>
            </ul>
          </div>
        </div>

        <div className="modal-actions-bar" style={{ marginTop: '20px' }}>
          <button
            type="button"
            className="btn-primary"
            style={{ margin: 'auto', fontSize: '16px', padding: '12px 32px' }}
            onClick={onClose}
          >
            {isEn ? 'Got It! Let\'s Play (समझ गए!)' : 'समझ गए! खेलें'}
          </button>
        </div>
      </div>
    </div>
  );
}
