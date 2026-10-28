import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FolderOpen, Target, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { CERTIFICATES } from '../data/certificates';
import Icon from './Icon';
import './FloatingDocumentDeck.css';

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
  const shelfRef = useRef(null);
  const touchRef = useRef(null);
  const [scroll, setScroll] = useState({ atStart: true, atEnd: false, progress: 0, visible: 1 });

  // Track the slider position for the arrows, edge fades and progress bar
  const updateScroll = useCallback(() => {
    const shelf = shelfRef.current;
    if (!shelf) return;
    const max = shelf.scrollWidth - shelf.clientWidth;
    setScroll({
      atStart: shelf.scrollLeft <= 2,
      atEnd: shelf.scrollLeft >= max - 2,
      progress: max > 0 ? shelf.scrollLeft / max : 0,
      visible: shelf.scrollWidth > 0 ? Math.min(1, shelf.clientWidth / shelf.scrollWidth) : 1
    });
  }, []);

  useEffect(() => {
    updateScroll();
    window.addEventListener('resize', updateScroll);
    return () => window.removeEventListener('resize', updateScroll);
  }, [updateScroll, documents.length]);

  const slide = (direction) => {
    const shelf = shelfRef.current;
    if (shelf) shelf.scrollBy({ left: direction * shelf.clientWidth * 0.9, behavior: 'smooth' });
  };

  // A vertical mouse wheel moves the slider sideways
  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) shelfRef.current.scrollLeft += e.deltaY;
  };

  // Touch: a sideways swipe scrolls the slider; pulling a card down drags it to a basket
  const clearDragOver = () => {
    document.querySelectorAll('.gamified-basket-container').forEach(b => b.classList.remove('drag-over'));
  };

  const handleTouchStart = (e, docId) => {
    const touch = e.touches[0];
    touchRef.current = {
      docId,
      card: e.currentTarget,
      startX: touch.clientX,
      startY: touch.clientY,
      mode: 'pending',
      clone: null
    };
  };

  const startTouchDrag = (t, touch) => {
    const card = t.card;
    const clone = card.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.zIndex = '9999';
    clone.style.pointerEvents = 'none';
    clone.style.width = `${card.offsetWidth}px`;
    clone.style.opacity = '0.92';
    clone.style.transform = 'scale(1.08) rotate(3deg)';
    clone.style.left = `${touch.clientX - card.offsetWidth / 2}px`;
    clone.style.top = `${touch.clientY - card.offsetHeight / 2}px`;
    document.body.appendChild(clone);
    t.clone = clone;
    t.mode = 'drag';
    onDragStartDoc(t.docId);
  };

  const handleTouchMove = (e) => {
    const t = touchRef.current;
    if (!t) return;
    const touch = e.touches[0];

    if (t.mode === 'pending') {
      const dx = touch.clientX - t.startX;
      const dy = touch.clientY - t.startY;
      if (Math.hypot(dx, dy) < 10) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        t.mode = 'scroll';
        return;
      }
      startTouchDrag(t, touch);
    }
    if (t.mode !== 'drag') return;

    const { clone } = t;
    clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
    clone.style.top = `${touch.clientY - clone.offsetHeight / 2}px`;

    const bucketElem = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.gamified-basket-container');
    clearDragOver();
    if (bucketElem) bucketElem.classList.add('drag-over');
  };

  const handleTouchEnd = (e) => {
    const t = touchRef.current;
    touchRef.current = null;
    if (!t || t.mode !== 'drag') return;

    clearDragOver();
    t.clone.remove();

    const touch = e.changedTouches[0];
    const bucketWrapper = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.gamified-bucket-wrapper');
    if (bucketWrapper && bucketWrapper.dataset.bucketId) {
      onDropDoc(t.docId, bucketWrapper.dataset.bucketId);
    }
  };

  const handleTouchCancel = () => {
    const t = touchRef.current;
    touchRef.current = null;
    if (t?.clone) t.clone.remove();
    clearDragOver();
  };

  const thumbWidth = scroll.visible * 100;

  return (
    <section className="top-prerequisites-deck-container">
      {/* Shelf Header */}
      <div className="deck-header-row">
        <div className="deck-title-group">
          <span className="deck-live-orb" />
          <h2 className="deck-title-text">
            <Icon as={FolderOpen} />
            <span>{isEn ? 'Floating Prerequisite Documents' : 'प्रमाण पत्र दस्तावेज़'}</span>
            <span className="deck-count-pill">{documents.length}</span>
          </h2>
        </div>

        <div className="deck-nav">
          <span className="deck-nav-hint">
            {isEn ? 'Swipe or scroll for more' : 'और दस्तावेज़ों के लिए स्वाइप करें'}
          </span>
          <button
            type="button"
            className="deck-nav-btn"
            onClick={() => slide(-1)}
            disabled={scroll.atStart}
            aria-label={isEn ? 'Previous documents' : 'पिछले दस्तावेज़'}
          >
            <Icon as={ChevronLeft} />
          </button>
          <button
            type="button"
            className="deck-nav-btn"
            onClick={() => slide(1)}
            disabled={scroll.atEnd}
            aria-label={isEn ? 'More documents' : 'अगले दस्तावेज़'}
          >
            <Icon as={ChevronRight} />
          </button>
        </div>
      </div>

      {/* Horizontal slider: two rows of cards that scroll along the x axis */}
      <div className={`deck-viewport ${scroll.atStart ? '' : 'fade-left'} ${scroll.atEnd ? '' : 'fade-right'}`}>
        <div
          ref={shelfRef}
          className="floating-boxes-shelf"
          onScroll={updateScroll}
          onWheel={handleWheel}
          tabIndex={0}
          aria-label={isEn ? 'Prerequisite documents' : 'प्रमाण पत्र दस्तावेज़'}
        >
          {documents.map((doc, index) => {
            const isSelected = selectedDocId === doc.id;
            const title = isEn ? doc.title_en : doc.title_hi;

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
                onTouchCancel={handleTouchCancel}
                title={title}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="box-selected-pill">
                    <span><Icon as={Target} /> {isEn ? 'SELECTED' : 'चयनित'}</span>
                  </div>
                )}

                {/* Box Top */}
                <div className="box-top-row">
                  <div className="box-stamp-icon"><Icon as={doc.icon} /></div>
                  <span className="box-tag-badge">
                    {isEn ? doc.tag_en : doc.tag_hi}
                  </span>
                </div>

                {/* Title Content */}
                <div className="box-body-content">
                  <h4 className="box-title-text">{title}</h4>
                </div>

                {/* Already Slotted Indicators */}
                {collectedIn.length > 0 && (
                  <div className="box-status-bar">
                    <div className="box-collected-row">
                      {collectedIn.map(c => (
                        <span key={c.id} className="basket-deposited-pill" style={{ borderColor: c.color }}>
                          <Icon as={Check} /> {isEn ? c.name_en.split(' ')[0] : c.name_hi.split(' ')[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Slider position */}
      <div className="deck-progress-track" aria-hidden="true">
        <div
          className="deck-progress-thumb"
          style={{ width: `${thumbWidth}%`, left: `${scroll.progress * (100 - thumbWidth)}%` }}
        />
      </div>
    </section>
  );
}
