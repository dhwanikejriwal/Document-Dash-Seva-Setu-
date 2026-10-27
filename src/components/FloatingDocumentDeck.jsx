import React, { useRef } from 'react';
import { CERTIFICATES } from '../data/certificates';

export default function FloatingDocumentDeck({
  documents = [],
  collectedByCertificate = {},
  selectedDocId = null,
  lang = 'en',
  onSelectDoc,
  onDragStartDoc,
  onDropDoc
}) {
  const isEn = lang === 'en';
  const touchCloneRef = useRef(null);

  // Touch drag handling for mobile / touch devices
  const handleTouchStart = (e, docId) => {
    const touch = e.touches[0];
    const targetCard = e.currentTarget;

    const clone = targetCard.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.width = `${targetCard.offsetWidth}px`;
    clone.style.opacity = '0.92';
    clone.style.transform = 'scale(1.08) rotate(3deg)';
    clone.style.left = `${touch.clientX - targetCard.offsetWidth / 2}px`;
    clone.style.top = `${touch.clientY - targetCard.offsetHeight / 2}px`;
    document.body.appendChild(clone);
    touchCloneRef.current = { clone, docId };
  };

  const handleTouchMove = (e) => {
    if (!touchCloneRef.current) return;
    const touch = e.touches[0];
    const { clone } = touchCloneRef.current;
    clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
    clone.style.top = `${touch.clientY - clone.offsetHeight / 2}px`;

    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const bucketElem = elemBelow?.closest('.gamified-basket-container');
    document.querySelectorAll('.gamified-basket-container').forEach(b => b.classList.remove('drag-over'));
    if (bucketElem) {
      bucketElem.classList.add('drag-over');
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchCloneRef.current) return;
    const { clone, docId } = touchCloneRef.current;
    const touch = e.changedTouches[0];
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const bucketWrapper = elemBelow?.closest('.gamified-bucket-wrapper');

    document.querySelectorAll('.gamified-basket-container').forEach(b => b.classList.remove('drag-over'));

    if (clone.parentNode) {
      clone.parentNode.removeChild(clone);
    }
    touchCloneRef.current = null;

    if (bucketWrapper && bucketWrapper.dataset.bucketId) {
      onDropDoc(docId, bucketWrapper.dataset.bucketId);
    }
  };

  return (
    <section className="top-prerequisites-deck-container">
      {/* Shelf Header */}
      <div className="deck-header-row">
        <div className="deck-title-group">
          <span className="deck-live-orb" />
          <h2 className="deck-title-text">
            <span>🗂️</span>
            <span>{isEn ? 'Floating Prerequisite Documents' : 'प्रमाण पत्र दस्तावेज़'}</span>
            <span className="deck-count-pill">{documents.length}</span>
          </h2>
        </div>
      </div>

      {/* All 12 Floating Cards in a Grid (No Slider Needed!) */}
      <div className="floating-boxes-shelf grid-layout-all">
        {documents.map((doc, index) => {
          const isSelected = selectedDocId === doc.id;

          // Check which certificates have already collected this doc
          const collectedIn = CERTIFICATES.filter(cert =>
            collectedByCertificate[cert.id]?.includes(doc.id)
          );

          // Stagger floating bobbing delay
          const animDelay = `${(index % 6) * 0.35}s`;

          return (
            <div
              key={doc.id}
              className={`floating-doc-box ${isSelected ? 'box-selected' : ''}`}
              style={{ animationDelay: animDelay }}
              draggable
              onClick={() => onSelectDoc(isSelected ? null : doc.id)}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', doc.id);
                e.dataTransfer.effectAllowed = 'move';
                onDragStartDoc(doc.id);
              }}
              onTouchStart={(e) => handleTouchStart(e, doc.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              title={isEn ? doc.description_en : doc.description_hi}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="box-selected-pill">
                  <span>🎯 {isEn ? 'SELECTED' : 'चयनित'}</span>
                </div>
              )}

              {/* Box Top */}
              <div className="box-top-row">
                <div className="box-stamp-icon">{doc.icon}</div>
                <span className="box-tag-badge">
                  {isEn ? doc.tag : doc.tag_hi}
                </span>
              </div>

              {/* Title Content */}
              <div className="box-body-content">
                <h4 className="box-title-text">
                  {isEn ? doc.title_en : doc.title_hi}
                </h4>
              </div>

              {/* Already Slotted Indicators */}
              {collectedIn.length > 0 && (
                <div className="box-status-bar">
                  <div className="box-collected-row">
                    {collectedIn.map(c => (
                      <span key={c.id} className="basket-deposited-pill" style={{ borderColor: c.color }}>
                        ✓ {isEn ? c.name_en.split(' ')[0] : c.name_hi.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
