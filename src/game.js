import confetti from 'canvas-confetti';
import { sound } from './audio.js';
import { CERTIFICATE_META, BUCKETS, ALL_DOCUMENTS, LEVELS, MASCOT_DIALOGUES } from './data.js';

export class GameEngine {
  constructor(threeWorld) {
    this.threeWorld = threeWorld;
    this.currentLevelIndex = 0;
    this.lang = 'en'; // 'en' | 'hi'
    this.score = 0;
    this.streak = 0;
    this.highestStreak = 0;
    this.placedDocs = {
      affidavit: null,
      stay_15: null,
      education: null,
      distractors: []
    };
    this.currentDeck = [];
    this.isLevelComplete = false;
    this.draggedDocId = null;

    this.initDOMReferences();
    this.bindEvents();
    this.loadLevel(0);
  }

  initDOMReferences() {
    this.dom = {
      scoreVal: document.getElementById('score-val'),
      streakVal: document.getElementById('streak-val'),
      levelBadge: document.getElementById('level-badge'),
      targetCertTitle: document.getElementById('target-cert-title'),
      mascotSpeech: document.getElementById('mascot-speech'),
      toast: document.getElementById('floating-toast'),
      toastHeading: document.getElementById('toast-heading'),
      toastSub: document.getElementById('toast-sub'),
      toastIcon: document.getElementById('toast-icon'),
      documentsShelf: document.getElementById('documents-shelf'),
      bucketsStage: document.getElementById('buckets-stage'),
      certModal: document.getElementById('certificate-modal'),
      certApplicantName: document.getElementById('cert-applicant-name'),
      certBodyText: document.getElementById('cert-body-text'),
      certIssueDate: document.getElementById('cert-issue-date'),
      certAppNo: document.getElementById('cert-app-no'),
      btnPlayNext: document.getElementById('btn-play-next'),
      btnCloseModal: document.getElementById('btn-close-modal'),
      btnDownloadCert: document.getElementById('btn-download-cert'),
      langToggleBtn: document.getElementById('lang-toggle-btn'),
      audioToggleBtn: document.getElementById('audio-toggle-btn'),
      helpModal: document.getElementById('help-modal'),
      btnOpenHelp: document.getElementById('btn-open-help'),
      btnCloseHelp: document.getElementById('btn-close-help')
    };
  }

  bindEvents() {
    // Language Toggle
    this.dom.langToggleBtn?.addEventListener('click', () => {
      this.lang = this.lang === 'en' ? 'hi' : 'en';
      this.dom.langToggleBtn.textContent = this.lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English';
      sound.playPickup();
      this.render();
    });

    // Audio Mute Toggle
    this.dom.audioToggleBtn?.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      this.dom.audioToggleBtn.textContent = isMuted ? '🔇' : '🔊';
    });

    // Modal buttons
    this.dom.btnPlayNext?.addEventListener('click', () => {
      this.closeModal();
      if (this.currentLevelIndex < LEVELS.length - 1) {
        this.loadLevel(this.currentLevelIndex + 1);
      } else {
        // Reset or champion replay
        this.loadLevel(0);
      }
    });

    this.dom.btnCloseModal?.addEventListener('click', () => {
      this.closeModal();
    });

    this.dom.btnDownloadCert?.addEventListener('click', () => {
      sound.playSuccess();
      window.print();
    });

    // Help modal
    this.dom.btnOpenHelp?.addEventListener('click', () => {
      if (this.dom.helpModal) this.dom.helpModal.classList.add('active');
    });
    this.dom.btnCloseHelp?.addEventListener('click', () => {
      if (this.dom.helpModal) this.dom.helpModal.classList.remove('active');
    });

    // Global dragover preventDefault
    document.addEventListener('dragover', (e) => e.preventDefault());
  }

  loadLevel(levelIdx) {
    this.currentLevelIndex = levelIdx;
    const levelData = LEVELS[levelIdx];
    this.isLevelComplete = false;

    // Reset placed docs
    this.placedDocs = {
      affidavit: null,
      stay_15: null,
      education: null,
      distractors: []
    };

    // Filter documents for this level
    this.currentDeck = levelData.docsPool.map(id => {
      return ALL_DOCUMENTS.find(d => d.id === id);
    }).filter(Boolean);

    // Reset 3D Certificate mesh position
    this.threeWorld.reset3DCertificate();

    // Set Welcome Mascot Dialogue
    const msg = levelIdx === 0
      ? MASCOT_DIALOGUES.welcome[this.lang]
      : `${levelData[`name_${this.lang}`]}: ${levelData[`hint_${this.lang}`]}`;
    this.setMascotSpeech(msg);

    this.render();
  }

  setMascotSpeech(text) {
    if (this.dom.mascotSpeech) {
      this.dom.mascotSpeech.innerHTML = text;
    }
  }

  showToast(type, heading, sub, icon = '✨') {
    if (!this.dom.toast) return;

    this.dom.toast.className = `floating-toast ${type === 'error' ? 'error-toast' : ''} show`;
    this.dom.toastHeading.textContent = heading;
    this.dom.toastSub.textContent = sub;
    this.dom.toastIcon.textContent = icon;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.dom.toast.classList.remove('show');
    }, 2800);
  }

  handleDrop(docId, targetBucketId) {
    const doc = ALL_DOCUMENTS.find(d => d.id === docId);
    if (!doc) return;

    sound.playDrop();

    // Check validity
    let isCorrect = false;

    if (targetBucketId === 'distractors') {
      // Rejection bin
      if (doc.category === 'REJECT') {
        isCorrect = true;
      } else {
        // Player threw a VALID document into reject bin
        this.handleIncorrectDrop(doc, targetBucketId, 'misplacedReject');
        return;
      }
    } else {
      // Normal category slot
      if (doc.bucketId === targetBucketId) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      this.handleCorrectDrop(doc, targetBucketId);
    } else {
      this.handleIncorrectDrop(doc, targetBucketId, 'wrongBucket');
    }
  }

  handleCorrectDrop(doc, targetBucketId) {
    // 1. Update state
    if (targetBucketId === 'distractors') {
      this.placedDocs.distractors.push(doc);
    } else {
      this.placedDocs[targetBucketId] = doc;
    }

    // Remove from shelf
    this.currentDeck = this.currentDeck.filter(d => d.id !== doc.id);

    // 2. Score & Streak
    this.streak++;
    if (this.streak > this.highestStreak) this.highestStreak = this.streak;
    const multiplier = Math.min(this.streak, 4);
    const addedScore = 150 * multiplier;
    this.score += addedScore;

    // 3. Audio & 3D Visual Feedback
    sound.playSuccess();
    this.threeWorld.triggerPodSuccess(targetBucketId);

    // 4. Toast & Mascot
    const heading = this.lang === 'en' ? 'PERFECT MATCH! + ' + addedScore : 'बिल्कुल सही! + ' + addedScore;
    const sub = this.lang === 'en' ? doc.title_en : doc.title_hi;
    this.showToast('success', heading, sub, '✅');

    let speech = MASCOT_DIALOGUES.correctReject[this.lang];
    if (targetBucketId === 'affidavit') speech = MASCOT_DIALOGUES.correctAffidavit[this.lang];
    else if (targetBucketId === 'stay_15') speech = MASCOT_DIALOGUES.correctStay15[this.lang];
    else if (targetBucketId === 'education') speech = MASCOT_DIALOGUES.correctEducation[this.lang];
    this.setMascotSpeech(speech);

    // Mini confetti on correct drop
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.6 }
    });

    this.render();

    // Check level completion
    this.checkCompletion();
  }

  handleIncorrectDrop(doc, targetBucketId, reasonType) {
    this.streak = 0; // reset streak
    sound.playError();
    this.threeWorld.triggerPodError(targetBucketId);

    const heading = this.lang === 'en' ? 'Oops! Not This Slot' : 'अरे! यह सही जगह नहीं है';
    let sub = doc[`info_${this.lang}`];
    this.showToast('error', heading, sub, '⚠️');

    if (reasonType === 'misplacedReject') {
      this.setMascotSpeech(MASCOT_DIALOGUES.misplacedReject[this.lang]);
    } else {
      this.setMascotSpeech(`${MASCOT_DIALOGUES.wrongBucket[this.lang]} <strong>${doc[`title_${this.lang}`]}</strong>: ${doc[`info_${this.lang}`]}`);
    }

    this.render();
  }

  checkCompletion() {
    // A level is complete when all 3 mandatory categories (Affidavit, 15-Yr Stay, Education) are satisfied!
    const isMandatoryMet = this.placedDocs.affidavit && this.placedDocs.stay_15 && this.placedDocs.education;

    if (isMandatoryMet && !this.isLevelComplete) {
      this.isLevelComplete = true;

      // Celebrate!
      this.setMascotSpeech(MASCOT_DIALOGUES.levelComplete[this.lang]);
      sound.playFanfare();

      setTimeout(() => {
        sound.playUnlock();
        this.threeWorld.reveal3DCertificate(() => {
          this.triggerUnlockModal();
        });
      }, 700);
    }
  }

  triggerUnlockModal() {
    // Grand Confetti Fireworks
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Populate Certificate Data
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const randomAppNo = 'CG-DOM-' + Math.floor(100000 + Math.random() * 900000);

    if (this.dom.certIssueDate) this.dom.certIssueDate.textContent = currentDate;
    if (this.dom.certAppNo) this.dom.certAppNo.textContent = randomAppNo;

    // Body text in Certificate
    const stayDocTitle = this.placedDocs.stay_15 ? this.placedDocs.stay_15[`title_${this.lang}`] : '15-Year Residence Proof';
    const eduDocTitle = this.placedDocs.education ? this.placedDocs.education[`title_${this.lang}`] : 'Educational Marksheet';

    if (this.dom.certBodyText) {
      if (this.lang === 'en') {
        this.dom.certBodyText.innerHTML = `
          This is to certify that applicant <strong>TEST USER (आनंद कुमार साहू)</strong> has verified permanent domicile in the State of <strong>Chhattisgarh</strong> under the rules of the General Administration Department.
          The citizen has verified compliance with all statutory prerequisites: (1) <strong>Notarized Affidavit</strong> of domicile; (2) <strong>${stayDocTitle}</strong> affirming 15+ years continuous stay; and (3) <strong>${eduDocTitle}</strong> proving recognized study within the State of Chhattisgarh.
        `;
      } else {
        this.dom.certBodyText.innerHTML = `
          प्रमाणित किया जाता है कि आवेदक <strong>TEST USER (आनंद कुमार साहू)</strong> ने सामान्य प्रशासन विभाग के दिशा-निर्देशों के तहत <strong>छत्तीसगढ़ राज्य</strong> के स्थायी निवास की पात्रता सिद्ध की है।
          आवेदक ने सभी अनिवार्य दस्तावेज़ प्रस्तुत किए हैं: (१) <strong>शपथ पत्र</strong>; (२) <strong>${stayDocTitle}</strong> (१५ वर्ष निरंतर निवास); एवं (३) <strong>${eduDocTitle}</strong> (छत्तीसगढ़ राज्य में मान्यता प्राप्त अध्ययन)।
        `;
      }
    }

    // Modal button text
    if (this.dom.btnPlayNext) {
      if (this.currentLevelIndex < LEVELS.length - 1) {
        this.dom.btnPlayNext.textContent = this.lang === 'en' ? '🎮 Next Challenge Level' : '🎮 अगला चैलेंज खेलें';
      } else {
        this.dom.btnPlayNext.textContent = this.lang === 'en' ? '🏆 Champion Replay' : '🏆 चैम्पियन पुनः खेलें';
      }
    }

    if (this.dom.certModal) {
      this.dom.certModal.classList.add('active');
    }
  }

  closeModal() {
    if (this.dom.certModal) {
      this.dom.certModal.classList.remove('active');
    }
  }

  render() {
    const isEn = this.lang === 'en';
    const curLevel = LEVELS[this.currentLevelIndex];

    // HUD Stats
    if (this.dom.scoreVal) this.dom.scoreVal.textContent = this.score;
    if (this.dom.streakVal) this.dom.streakVal.textContent = `${this.streak}x`;
    if (this.dom.levelBadge) this.dom.levelBadge.textContent = isEn ? `Lvl ${curLevel.level}` : `लेवल ${curLevel.level}`;
    if (this.dom.targetCertTitle) this.dom.targetCertTitle.textContent = isEn ? CERTIFICATE_META.title_en : CERTIFICATE_META.title_hi;

    // Render Buckets
    this.renderBuckets();

    // Render Shelf Documents
    this.renderShelf();
  }

  renderBuckets() {
    if (!this.dom.bucketsStage) return;
    this.dom.bucketsStage.innerHTML = '';

    BUCKETS.forEach(bucket => {
      const isReject = bucket.isRejectBin;
      const isFilled = !isReject && !!this.placedDocs[bucket.id];
      const filledDoc = isReject ? null : this.placedDocs[bucket.id];

      const card = document.createElement('div');
      card.className = `bucket-target-card ${isFilled ? 'filled' : ''}`;
      card.style.setProperty('--pod-glow', bucket.color);
      card.dataset.bucketId = bucket.id;

      // Card Header
      const header = document.createElement('div');
      header.className = 'bucket-header';

      const titleBox = document.createElement('div');
      titleBox.className = 'bucket-title-box';

      const icon = document.createElement('span');
      icon.className = 'bucket-icon';
      icon.textContent = bucket.icon;

      const title = document.createElement('span');
      title.className = 'bucket-title';
      title.textContent = this.lang === 'en' ? bucket.name_en : bucket.name_hi;

      titleBox.appendChild(icon);
      titleBox.appendChild(title);

      const mandTag = document.createElement('span');
      mandTag.className = `bucket-mand-tag ${isReject ? 'reject-tag' : ''}`;
      mandTag.textContent = isReject
        ? (this.lang === 'en' ? 'Reject Bin' : 'अमान्य पेटी')
        : (this.lang === 'en' ? 'Mandatory' : 'अनिवार्य');

      header.appendChild(titleBox);
      header.appendChild(mandTag);

      // Subtitle
      const sub = document.createElement('div');
      sub.className = 'bucket-sub';
      sub.textContent = this.lang === 'en' ? bucket.subtitle_en : bucket.subtitle_hi;

      // Drop Slot Area
      const slotArea = document.createElement('div');
      slotArea.className = 'bucket-slot-area';

      if (isReject) {
        const rejectCount = this.placedDocs.distractors.length;
        if (rejectCount === 0) {
          slotArea.innerHTML = `<span class="slot-placeholder">${this.lang === 'en' ? 'Drop non-domicile/caste/income docs here' : 'अन्य या अमान्य दस्तावेज़ यहाँ डालें'}</span>`;
        } else {
          slotArea.innerHTML = `
            <div class="slot-filled-card" style="border-color: var(--accent-crimson); color: var(--accent-crimson);">
              <span>🚫</span>
              <span>${rejectCount} ${this.lang === 'en' ? 'Distractors Filtered' : 'अमान्य दस्तावेज़ छांटे गए'}</span>
            </div>
          `;
        }
      } else if (isFilled && filledDoc) {
        slotArea.innerHTML = `
          <div class="slot-filled-card">
            <span>✅</span>
            <span>${this.lang === 'en' ? filledDoc.title_en : filledDoc.title_hi}</span>
          </div>
        `;
      } else {
        slotArea.innerHTML = `<span class="slot-placeholder">${this.lang === 'en' ? 'Drag matching document here' : 'यहाँ दस्तावेज़ खींचकर रखें'}</span>`;
      }

      // Progress Bar
      const progressWrap = document.createElement('div');
      progressWrap.className = 'bucket-progress-bar';
      const progressFill = document.createElement('div');
      progressFill.className = 'bucket-progress-fill';
      progressFill.style.width = isFilled ? '100%' : (isReject && this.placedDocs.distractors.length ? '100%' : '0%');
      progressWrap.appendChild(progressFill);

      card.appendChild(header);
      card.appendChild(sub);
      card.appendChild(slotArea);
      card.appendChild(progressWrap);

      // HTML5 Drag and Drop events on bucket
      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        card.classList.add('drag-over');
      });

      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });

      card.addEventListener('drop', (e) => {
        e.preventDefault();
        card.classList.remove('drag-over');
        const docId = e.dataTransfer?.getData('text/plain') || this.draggedDocId;
        if (docId) {
          this.handleDrop(docId, bucket.id);
        }
      });

      // Click on bucket to assign selected card (accessibility)
      card.addEventListener('click', () => {
        if (this.activeSelectedDocId) {
          this.handleDrop(this.activeSelectedDocId, bucket.id);
          this.activeSelectedDocId = null;
          this.renderShelf();
        }
      });

      this.dom.bucketsStage.appendChild(card);
    });
  }

  renderShelf() {
    if (!this.dom.documentsShelf) return;
    this.dom.documentsShelf.innerHTML = '';

    if (this.currentDeck.length === 0) {
      this.dom.documentsShelf.innerHTML = `
        <div style="margin: auto; color: var(--accent-green); font-weight: 700; font-size: 14px; padding: 10px;">
          🎉 ${this.lang === 'en' ? 'All documents in this level have been sorted!' : 'इस स्तर के सभी दस्तावेज़ छांट लिए गए हैं!'}
        </div>
      `;
      return;
    }

    this.currentDeck.forEach(doc => {
      const card = document.createElement('div');
      card.className = `doc-card ${this.activeSelectedDocId === doc.id ? 'dragging' : ''}`;
      card.draggable = true;
      card.dataset.docId = doc.id;

      // Top Row
      const top = document.createElement('div');
      top.className = 'doc-card-top';

      const stamp = document.createElement('div');
      stamp.className = 'doc-stamp-icon';
      stamp.textContent = doc.icon;

      const tag = document.createElement('div');
      tag.className = 'doc-tag-pill';
      tag.textContent = doc.tags[0] || 'Official';

      top.appendChild(stamp);
      top.appendChild(tag);

      // Body
      const body = document.createElement('div');
      body.className = 'doc-card-body';

      const title = document.createElement('div');
      title.className = 'doc-card-title';
      title.textContent = this.lang === 'en' ? doc.title_en : doc.title_hi;

      const desc = document.createElement('div');
      desc.className = 'doc-card-desc';
      desc.textContent = this.lang === 'en' ? doc.info_en : doc.info_hi;

      body.appendChild(title);
      body.appendChild(desc);

      // Actions / Footer
      const footer = document.createElement('div');
      footer.className = 'doc-card-actions';

      const dragHint = document.createElement('div');
      dragHint.className = 'drag-instruction';
      dragHint.innerHTML = `<span>🖐️</span> ${this.lang === 'en' ? 'Drag to Slot' : 'स्लॉट में खींचें'}`;

      const assignBtn = document.createElement('button');
      assignBtn.className = 'quick-assign-btn';
      assignBtn.textContent = this.lang === 'en' ? 'Select' : 'चुनें';
      assignBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.activeSelectedDocId === doc.id) {
          this.activeSelectedDocId = null;
        } else {
          this.activeSelectedDocId = doc.id;
          sound.playPickup();
          this.showToast('info', this.lang === 'en' ? 'Document Selected' : 'दस्तावेज़ चुना गया', this.lang === 'en' ? 'Now click the matching bucket slot above' : 'अब ऊपर किसी स्लॉट पर क्लिक करें', '🎯');
        }
        this.renderShelf();
      });

      footer.appendChild(dragHint);
      footer.appendChild(assignBtn);

      card.appendChild(top);
      card.appendChild(body);
      card.appendChild(footer);

      // Drag event listeners
      card.addEventListener('dragstart', (e) => {
        this.draggedDocId = doc.id;
        card.classList.add('dragging');
        sound.playPickup();
        if (e.dataTransfer) {
          e.dataTransfer.setData('text/plain', doc.id);
          e.dataTransfer.effectAllowed = 'move';
        }
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        this.draggedDocId = null;
      });

      // Touch Drag Support for Tablets / Mobile
      this.attachTouchDrag(card, doc.id);

      this.dom.documentsShelf.appendChild(card);
    });
  }

  attachTouchDrag(element, docId) {
    let clone = null;

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      this.draggedDocId = docId;
      sound.playPickup();

      clone = element.cloneNode(true);
      clone.style.position = 'fixed';
      clone.style.zIndex = '9999';
      clone.style.pointerEvents = 'none';
      clone.style.width = `${element.offsetWidth}px`;
      clone.style.opacity = '0.9';
      clone.style.transform = 'scale(1.05)';
      clone.style.left = `${touch.clientX - element.offsetWidth / 2}px`;
      clone.style.top = `${touch.clientY - element.offsetHeight / 2}px`;
      document.body.appendChild(clone);
    };

    const onTouchMove = (e) => {
      if (!clone) return;
      const touch = e.touches[0];
      clone.style.left = `${touch.clientX - clone.offsetWidth / 2}px`;
      clone.style.top = `${touch.clientY - clone.offsetHeight / 2}px`;

      // Check hover over buckets
      const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const bucketCard = elemBelow?.closest('.bucket-target-card');
      document.querySelectorAll('.bucket-target-card').forEach(b => b.classList.remove('drag-over'));
      if (bucketCard) {
        bucketCard.classList.add('drag-over');
      }
    };

    const onTouchEnd = (e) => {
      if (!clone) return;
      const touch = e.changedTouches[0];
      const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
      const bucketCard = elemBelow?.closest('.bucket-target-card');

      document.querySelectorAll('.bucket-target-card').forEach(b => b.classList.remove('drag-over'));
      if (clone.parentNode) {
        clone.parentNode.removeChild(clone);
      }
      clone = null;

      if (bucketCard && bucketCard.dataset.bucketId) {
        this.handleDrop(docId, bucketCard.dataset.bucketId);
      }
      this.draggedDocId = null;
    };

    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: true });
  }
}
