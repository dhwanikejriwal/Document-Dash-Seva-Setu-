import React from 'react';
import { CircleCheck, Circle } from 'lucide-react';
import { metRequirementCount, mandatoryRequirements } from '../data/certificates';
import { DOCUMENTS } from '../data/documents';
import Icon from './Icon';
import './RequirementsHint.css';

const DOCUMENT_BY_ID = Object.fromEntries(DOCUMENTS.map(doc => [doc.id, doc]));

// Hint panel above a certificate basket: each document type it needs, ticked once
// filled, otherwise listing the supporting documents that would fill it.
export default function RequirementsHint({ certificate, collectedDocIds = [], lang = 'en' }) {
  const isEn = lang === 'en';
  const docTitle = doc => (isEn ? doc.title_en : doc.title_hi);

  return (
    <div
      className="req-hint"
      role="tooltip"
      style={{ '--cert-color': certificate.color }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="req-hint-header">
        <span className="req-hint-icon"><Icon as={certificate.icon} /></span>
        <div className="req-hint-titles">
          <strong>{isEn ? certificate.name_en : certificate.name_hi}</strong>
          <span>{isEn ? 'Documents required' : 'आवश्यक दस्तावेज़'}</span>
        </div>
        <span className="req-hint-count">
          {metRequirementCount(certificate, collectedDocIds)}/{mandatoryRequirements(certificate).length}
        </span>
      </div>

      <ol className="req-hint-list">
        {certificate.requirements.map(req => {
          const filledBy = DOCUMENT_BY_ID[collectedDocIds.find(id => req.docIds.includes(id))];
          const options = req.docIds.map(id => DOCUMENT_BY_ID[id]);

          return (
            <li key={req.id} className={`req-hint-item ${filledBy ? 'is-met' : ''}`}>
              <div className="req-hint-type">
                <Icon as={filledBy ? CircleCheck : Circle} className="req-hint-status" />
                <span>{isEn ? req.name_en : req.name_hi}</span>
                {!req.mandatory && (
                  <span className="req-hint-optional">{isEn ? 'Optional' : 'वैकल्पिक'}</span>
                )}
              </div>

              {/* A single-document type is named after its document, so only name real choices */}
              {options.length > 1 && (filledBy ? (
                <div className="req-hint-filled">
                  <Icon as={filledBy.icon} /> {docTitle(filledBy)}
                </div>
              ) : (
                <>
                  <div className="req-hint-anyone">{isEn ? 'Any one of:' : 'इनमें से कोई एक:'}</div>
                  <ul className="req-hint-docs">
                    {options.map(doc => (
                      <li key={doc.id} className="req-hint-doc">
                        <Icon as={doc.icon} /> {docTitle(doc)}
                      </li>
                    ))}
                  </ul>
                </>
              ))}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
