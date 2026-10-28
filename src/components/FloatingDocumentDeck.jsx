import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { FolderOpen, Target, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { CERTIFICATES, isDocumentStillNeeded } from '../data/certificates';
import Icon from './Icon';
import './FloatingDocumentDeck.css';

// Matches the docLeave animation in FloatingDocumentDeck.css
const LEAVE_MS = 350;

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

  // Cards leave the shelf once every requirement they could fill is filled:
  // they fade out first, then drop out of the grid.
  const [removedIds, setRemovedIds] = useState(() => new Set());
  const removalTimers = useRef(new Map());
  const neededIds = new Set(
    documents.filter(doc => isDocumentStillNeeded(doc.id, collectedByCertificate)).map(doc => doc.id)
  );
  const shownDocs = documents.filter(doc => !removedIds.has(doc.id));
  const shownKey = shownDocs.map(doc => doc.id).join('|');

  useEffect(() => {
    shownDocs.forEach(doc => {
      if (neededIds.has(doc.id) || removalTimers.current.has(doc.id)) return;
      removalTimers.current.set(doc.id, setTimeout(() => {
        removalTimers.current.delete(doc.id);
        setRemovedIds(prev => new Set(prev).add(doc.id));
      }, LEAVE_MS));
    });
  });

  useEffect(() => {
    const timers = removalTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // When cards drop out, slide the rest from their old spots into the gap (FLIP).
  // `composite: 'add'` layers the slide on top of each card's floating animation.
  const cardRefs = useRef(new Map());
  const lastPositions = useRef(new Map());
  useLayoutEffect(() => {
    const positions = new Map();
    cardRefs.current.forEach((card, id) => {
      const pos = { x: card.offsetLeft, y: card.offsetTop };
      positions.set(id, pos);
      const prev = lastPositions.current.get(id);
      if (prev && (prev.x !== pos.x || prev.y !== pos.y)) {
        card.animate(
          [{ transform: `translate(${prev.x - pos.x}px, ${prev.y - pos.y}px)` }, { transform: 'translate(0, 0)' }],
          { duration: 450, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', composite: 'add' }
        );
      }
    });
    lastPositions.current = positions;
  }, [shownKey]);

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
  }, [updateScroll, shownKey]);

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
            <span className="deck-count-pill" title={isEn ? 'Documents still needed' : 'शेष आवश्यक दस्तावेज़'}>
              {neededIds.size}
            </span>
          </h2>
        </div>
      </div>

      {/* Horizontal slider: two rows of cards that scroll along the x axis.
          Glowing arrows sit on each side, shown only when there is more to slide to. */}
      <div className="deck-slider">
        <button
          type="button"
          className={`deck-arrow deck-arrow--prev ${scroll.atStart ? 'is-hidden' : ''}`}
          onClick={() => slide(-1)}
          tabIndex={scroll.atStart ? -1 : 0}
          aria-hidden={scroll.atStart || undefined}
          aria-label={isEn ? 'Previous documents' : 'पिछले दस्तावेज़'}
        >
          <Icon as={ChevronLeft} />
        </button>
        <button
          type="button"
          className={`deck-arrow deck-arrow--next ${scroll.atEnd ? 'is-hidden' : ''}`}
          onClick={() => slide(1)}
          tabIndex={scroll.atEnd ? -1 : 0}
          aria-hidden={scroll.atEnd || undefined}
          aria-label={isEn ? 'More documents' : 'अगले दस्तावेज़'}
        >
          <Icon as={ChevronRight} />
        </button>

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
              if (removedIds.has(doc.id)) return null;
              const isSelected = selectedDocId === doc.id;
              const isLeaving = !neededIds.has(doc.id);
              const title = isEn ? doc.title_en : doc.title_hi;

              // Check which certificates have already collected this doc
              const collectedIn = CERTIFICATES.filter(cert =>
                collectedByCertificate[cert.id]?.includes(doc.id)
              );

              // Stagger floating bobbing delay (by deck position, so it stays put as cards leave)
              const animDelay = `${(index % 6) * 0.35}s`;

              return (
                <div
                  key={doc.id}
                  ref={el => (el ? cardRefs.current.set(doc.id, el) : cardRefs.current.delete(doc.id))}
                  className={`floating-doc-box ${isSelected ? 'box-selected' : ''} ${isLeaving ? 'box-leaving' : ''}`}
                  style={isLeaving ? undefined : { animationDelay: animDelay }}
                  aria-hidden={isLeaving || undefined}
                  draggable={!isLeaving}
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
