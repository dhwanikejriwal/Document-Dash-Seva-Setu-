import React from 'react';
import { ClipboardList, Lightbulb } from 'lucide-react';
import { CERTIFICATES, mandatoryRequirements } from '../data/certificates';
import Icon from './Icon';
import './HelpTutorialModal.css';

export default function HelpTutorialModal({ lang = 'en', onClose }) {
  const isEn = lang === 'en';

  return (
    <div className="modal-overlay active" role="dialog" aria-modal="true">
      <div className="cert-showcase-box help-guide-box">
        <div className="cert-header">
          <h2 className="cert-gov-title">
            <Icon as={ClipboardList} /> {isEn ? 'Seva Setu Certificate Prerequisite Guide' : 'सेवा सेतु प्रमाण पत्र नियम मार्गदर्शिका'}
          </h2>
          <div className="cert-gov-sub">
            {isEn
              ? 'Government of Chhattisgarh Official Citizen Guidelines'
              : 'छत्तीसगढ़ शासन के आधिकारिक नागरिक सेवा नियम'}
          </div>
        </div>

        <div className="help-guide-body">
          <p className="help-guide-intro">
            {isEn
              ? 'In Document Quest, you learn which documents belong to each of the 4 statutory certificates in Chhattisgarh:'
              : 'डॉक्यूमेंट क्वेस्ट में आप सीखते हैं कि छत्तीसगढ़ के ४ प्रमुख प्रमाण पत्रों के लिए कौन-से दस्तावेज़ अनिवार्य हैं:'}
          </p>

          <div className="help-cert-grid">
            {CERTIFICATES.map(c => (
              <div key={c.id} className="help-cert-card" style={{ '--cert-color': c.color }}>
                <div className="help-cert-title">
                  <span className="help-cert-icon"><Icon as={c.icon} /></span>
                  <span>{isEn ? c.name_en : c.name_hi}</span>
                </div>
                <div className="help-cert-sub">
                  {isEn ? c.subtitle_en : c.subtitle_hi}
                </div>
                <div className="help-cert-count">
                  {isEn
                    ? `${mandatoryRequirements(c).length} Mandatory Document Types`
                    : `${mandatoryRequirements(c).length} अनिवार्य दस्तावेज़ प्रकार`}
                </div>
              </div>
            ))}
          </div>

          <div className="help-tips">
            <strong><Icon as={Lightbulb} /> {isEn ? 'Pro Citizen Tips:' : 'नागरिक सुझाव:'}</strong>
            <ul>
              <li>
                {isEn
                  ? 'One supporting document per type is enough: any one income proof completes "Income Proof".'
                  : 'हर दस्तावेज़ प्रकार के लिए एक सहायक दस्तावेज़ पर्याप्त है: कोई भी एक आय प्रमाण "आय प्रमाण" पूरा करता है।'}
              </li>
              <li>
                {isEn
                  ? 'Multi-purpose proofs: the Affidavit is needed for all four, and a Ration Card is income proof for Caste and residence proof for Domicile.'
                  : 'बहु-उद्देशीय दस्तावेज़: शपथ पत्र चारों के लिए आवश्यक है, और राशन कार्ड जाति हेतु आय प्रमाण तथा निवास हेतु निवास प्रमाण है।'}
              </li>
            </ul>
          </div>
        </div>

        <div className="modal-actions-bar help-guide-actions">
          <button
            type="button"
            className="btn-primary help-guide-cta"
            onClick={onClose}
          >
            {isEn ? 'Got It! Let\'s Play (समझ गए!)' : 'समझ गए! खेलें'}
          </button>
        </div>
      </div>
    </div>
  );
}
