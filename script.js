/* ============================================================
   PROJECT FOREVER — script.js
   Complete Vanilla JavaScript — No Frameworks
   ============================================================ */

'use strict';

/* ── STATE ─────────────────────────────────────────────────── */
const player = {
  currentIndex: 0,
  isPlaying:    false,
  isMuted:      false,
  isRepeat:     false,
  isShuffle:    false,
  volume:       0.8,
  audioCtx:     null,
  analyser:     null,
  source:       null,
  vizRaf:       null,
  finalRaf:     null,
  splashRaf:    null,
  finalTriggered: false,
  finalSequenceStep: 0,
};

/* ── ELEMENTS (populated after DOM ready) ───────────────────── */
let audio, voiceAudio;

/* ── DOM READY ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  audio      = document.getElementById('audio-element');
  voiceAudio = document.getElementById('voice-audio-element');

  restorePrefs();
  populateFromConfig();
  initSplash();
  initClickHearts();
});

/* ── RESTORE PREFERENCES ────────────────────────────────────── */
function restorePrefs() {
  const savedVol = localStorage.getItem('pf-volume');
  if (savedVol !== null) player.volume = parseFloat(savedVol);
}

/* ── POPULATE ALL CONTENT FROM CONFIG ───────────────────────── */
function populateFromConfig() {
  // Her name on splash
  const nameEl = document.getElementById('splash-name');
  if (nameEl) nameEl.textContent = CONFIG.her.name;

  // Track list
  const trackItems = document.querySelectorAll('.track-item');
  trackItems.forEach((item, i) => {
    const t = CONFIG.tracks[i];
    if (!t) return;
    const titleEl    = item.querySelector('.track-title');
    const artistEl   = item.querySelector('.track-artist');
    const langEl     = item.querySelector('.track-language');
    if (titleEl)  titleEl.textContent  = t.title;
    if (artistEl) artistEl.textContent = t.artist || '';
    if (langEl)   langEl.textContent   = t.language;
  });

  // Photos
  setPhoto('her-photo-img',   CONFIG.photos.her,      'her-photo-frame',   '[ Her Photo ]');
  setPhoto('her-eyes-img',    CONFIG.photos.herEyes,   'her-eyes-frame',    '[ Her Eyes ]');
  setPhoto('group-photo-img', CONFIG.photos.group,     'group-photo-frame', '[ Group Photo ]');
  setPhoto('both-eyes-img',   CONFIG.photos.bothEyes,  'both-eyes-frame',   '[ Both Eyes ]');
  setPhoto('final-her-photo', CONFIG.photos.finalHer || CONFIG.photos.her, 'final-photo-frame', '[ Her Photo ]');

  // Album art
  const artEl = document.getElementById('album-art-display');
  if (artEl) {
    artEl.src = CONFIG.albumArt;
    artEl.onerror = () => { artEl.style.display = 'none'; };
  }

  // Voice label (HTML uses class voice-player-label)
  const voiceLabelEl = document.querySelector('.voice-label, .voice-player-label');
  if (voiceLabelEl) voiceLabelEl.textContent = CONFIG.voice.label;

  // Voice src
  if (voiceAudio) voiceAudio.src = CONFIG.voice.file;

  // Photo section messages
  const herMsg       = document.getElementById('her-eyes-message');
  const groupMsg     = document.getElementById('group-photo-message');
  const bothMsg      = document.getElementById('both-eyes-message');
  if (herMsg)   herMsg.textContent   = CONFIG.photoSections.herEyes.message;
  if (groupMsg) groupMsg.textContent = CONFIG.photoSections.group.message;
  if (bothMsg)  bothMsg.textContent  = CONFIG.photoSections.bothEyes.message;

  // Miss me options
  const missContainer = document.getElementById('miss-options');
  if (missContainer) {
    missContainer.innerHTML = '';
    CONFIG.missMe.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'miss-option-btn';
      btn.dataset.option = i;
      btn.innerHTML = `<span class="option-icon">${opt.icon}</span>${opt.label}`;
      missContainer.appendChild(btn);
    });
  }

  // Dream scenes
  const dreamContainer = document.getElementById('dream-scenes-container');
  if (dreamContainer) {
    dreamContainer.innerHTML = '';
    CONFIG.dreamScenes.forEach(scene => {
      const card = document.createElement('div');
      card.className = 'dream-scene-card';
      card.innerHTML = `
        <span class="scene-icon">${scene.icon}</span>
        <div class="scene-title">${scene.title}</div>
        <div class="scene-desc">${scene.desc}</div>
      `;
      dreamContainer.appendChild(card);
    });
  }

  // Final message lines
  const finalLines = document.getElementById('final-message-lines');
  if (finalLines) {
    finalLines.innerHTML = '';
    CONFIG.finalMessage.forEach(line => {
      const p = document.createElement('p');
      p.className = 'final-line';
      p.textContent = line;
      finalLines.appendChild(p);
    });
  }

  // Final track list
  const finalTracks = document.getElementById('final-track-list');
  if (finalTracks) {
    finalTracks.innerHTML = '';
    CONFIG.tracks.forEach((t, i) => {
      const li = document.createElement('li');
      li.textContent = `${String(i+1).padStart(2,'0')}. ${t.title}`;
      finalTracks.appendChild(li);
    });
  }

  // Connecting particle dots for both-eyes section
  const cpContainer = document.querySelector('.connecting-particles');
  if (cpContainer) {
    for (let i = 0; i < 12; i++) {
      const dot = document.createElement('div');
      dot.className = 'cp-dot';
      dot.style.left = Math.random() * 100 + '%';
      dot.style.top  = Math.random() * 100 + '%';
      dot.style.animationDuration = (4 + Math.random() * 6) + 's';
      dot.style.animationDelay   = (Math.random() * 4) + 's';
      dot.style.opacity = Math.random() * 0.5 + 0.2;
      cpContainer.appendChild(dot);
    }
  }
}

/* ── SET PHOTO HELPER ───────────────────────────────────────── */
function setPhoto(imgId, src, frameId, placeholderText) {
  const img   = document.getElementById(imgId);
  const frame = document.getElementById(frameId);
  if (!img) return;

  img.src = src;
  img.onerror = () => {
    img.style.display = 'none';
    if (frame) {
      let ph = frame.querySelector('.photo-placeholder');
      if (!ph) {
        ph = document.createElement('div');
        ph.className = 'photo-placeholder';
        ph.innerHTML = `<span class="placeholder-icon">📷</span><span>${placeholderText}</span>`;
        frame.appendChild(ph);
      }
      ph.style.display = 'flex';
    }
  };
  img.onload = () => {
    img.style.display = 'block';
    if (frame) {
      const ph = frame.querySelector('.photo-placeholder');
      if (ph) ph.style.display = 'none';
    }
  };
}

/* ══════════════════════════════════════════════════════════════
   SPLASH SCREEN
══════════════════════════════════════════════════════════════ */
function initSplash() {
  const splash = document.getElementById('splash-screen');
  const canvas = document.getElementById('splash-stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let meteors = [];
  let raf;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = createStarField(220);
  }

  function createStarField(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        r:       Math.random() * 1.5 + 0.3,
        base:    Math.random() * 0.5 + 0.25,
        speed:   Math.random() * 0.025 + 0.008,
        offset:  Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }

  function drawSplashStars(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(s => {
      const opacity = s.base + Math.sin(t * s.speed + s.offset) * s.base * 0.8;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, opacity))})`;
      ctx.fill();
    });

    // Occasional shooting star
    if (Math.random() < 0.012 && meteors.length < 2) {
      meteors.push({
        x: Math.random() * canvas.width * 0.85,
        y: Math.random() * canvas.height * 0.45,
        length: Math.random() * 90 + 50,
        speed: Math.random() * 8 + 8,
        opacity: 1,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2
      });
    }

    // Draw shooting stars
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      const endX = m.x - Math.cos(m.angle) * m.length;
      const endY = m.y - Math.sin(m.angle) * m.length;

      const grad = ctx.createLinearGradient(m.x, m.y, endX, endY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${m.opacity})`);
      grad.addColorStop(0.3, `rgba(255, 182, 193, ${m.opacity * 0.7})`);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(m.x, m.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.opacity -= 0.018;

      if (m.opacity <= 0 || m.x > canvas.width || m.y > canvas.height) {
        meteors.splice(i, 1);
      }
    }

    raf = requestAnimationFrame(drawSplashStars);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  raf = requestAnimationFrame(drawSplashStars);
  player.splashRaf = raf;

  // Enter button
  const btn = document.getElementById('enter-btn');
  if (btn) btn.addEventListener('click', enterWorld);
}

/* ── INTERACTIVE TOUCH / CLICK HEARTS ──────────────────────── */
function initClickHearts() {
  const symbols = ['❤️', '✨', '💖', '🌸', '🤍', '🌙', '🌷'];
  document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input, button, .track-item, #progress-container, #voice-progress-container')) return;
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';
    document.body.appendChild(heart);
    setTimeout(() => {
      heart.remove();
    }, 1400);
  });
}

/* ── ENTER WORLD ────────────────────────────────────────────── */
let entered = false;
function enterWorld() {
  if (entered) return;
  entered = true;

  const splash = document.getElementById('splash-screen');
  const main   = document.getElementById('main-content');
  const musicP = document.getElementById('music-player');

  if (splash) splash.classList.add('fade-out');

  setTimeout(() => {
    if (splash) splash.style.display = 'none';
    if (main)   main.classList.remove('hidden');
    if (musicP) musicP.style.display = 'flex';

    // Cancel splash canvas loop (optional — it's hidden anyway)
    if (player.splashRaf) cancelAnimationFrame(player.splashRaf);

    // Boot everything
    initMusicPlayer();
    initScrollReveal();
    initMissMe();
    initDreamSection();
    initFinalSection();
    initValentineGift();
    createFloatingPetals();
    createBodyStars();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1200);
}

/* ══════════════════════════════════════════════════════════════
   MUSIC PLAYER
══════════════════════════════════════════════════════════════ */
function initMusicPlayer() {
  if (!audio) return;

  audio.volume = player.volume;

  // Track item clicks
  document.querySelectorAll('.track-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.trackIndex, 10);
      loadTrack(idx, true);
    });
  });

  // Controls
  const ppBtn    = document.getElementById('play-pause-btn');
  const prevBtn  = document.getElementById('prev-btn');
  const nextBtn  = document.getElementById('next-btn');
  const muteBtn  = document.getElementById('mute-btn');
  const repBtn   = document.getElementById('repeat-btn');
  const shufBtn  = document.getElementById('shuffle-btn');
  const volSldr  = document.getElementById('volume-slider');
  const progCont = document.getElementById('progress-container');

  if (ppBtn)   ppBtn.addEventListener('click', togglePlayPause);
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);
  if (muteBtn) muteBtn.addEventListener('click', toggleMute);
  if (repBtn)  repBtn.addEventListener('click',  toggleRepeat);
  if (shufBtn) shufBtn.addEventListener('click', toggleShuffle);

  if (volSldr) {
    volSldr.value = player.volume;
    volSldr.addEventListener('input', e => setVolume(parseFloat(e.target.value)));
  }

  if (progCont) {
    progCont.addEventListener('click', e => {
      const rect = progCont.getBoundingClientRect();
      const pct  = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = pct * audio.duration;
    });
    // Touch seeking
    progCont.addEventListener('touchstart', handleProgressTouch, { passive: false });
    progCont.addEventListener('touchmove',  handleProgressTouch, { passive: false });
  }

  // Audio events
  audio.addEventListener('timeupdate', onTimeUpdate);
  audio.addEventListener('loadedmetadata', onMetaLoaded);
  audio.addEventListener('ended', onTrackEnded);
  audio.addEventListener('error', onAudioError);
  audio.addEventListener('play',  () => updatePlayIcon(true));
  audio.addEventListener('pause', () => updatePlayIcon(false));

  // Load last track (safely bounds-checked)
  let lastTrack = parseInt(localStorage.getItem('pf-last-track') || '0', 10);
  if (isNaN(lastTrack) || lastTrack < 0 || lastTrack >= CONFIG.tracks.length) {
    lastTrack = 0;
  }
  loadTrack(lastTrack, false);
}

function handleProgressTouch(e) {
  e.preventDefault();
  const touch = e.touches[0];
  const progCont = document.getElementById('progress-container');
  if (!progCont || !audio.duration) return;
  const rect = progCont.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
  audio.currentTime = pct * audio.duration;
}

function loadTrack(index, autoPlay) {
  if (index < 0 || index >= CONFIG.tracks.length) {
    index = 0;
  }
  const track = CONFIG.tracks[index];
  if (!track) return;

  player.currentIndex = index;
  localStorage.setItem('pf-last-track', index);

  audio.src = track.file;
  audio.load();

  // Update player UI
  const nameEl   = document.getElementById('player-song-name');
  const artistEl = document.getElementById('player-artist');
  const artEl    = document.getElementById('player-artwork');
  if (nameEl)   nameEl.textContent   = track.title;
  if (artistEl) artistEl.textContent = track.artist || track.language;
  if (artEl)    { artEl.src = CONFIG.albumArt; artEl.onerror = () => {}; }

  // Reset progress
  setProgressFill(0);
  setTimeDisplay('current-time', 0);
  setTimeDisplay('total-time', 0);

  // Highlight active track
  document.querySelectorAll('.track-item').forEach((item, i) => {
    item.classList.toggle('track-playing', i === index);
  });

  if (autoPlay) {
    showChapterOverlay(index);
  } else {
    // Just update the UI
    player.isPlaying = false;
    updatePlayIcon(false);
    setArtworkSpin(false);
  }
}

/* ── PLAY / PAUSE ───────────────────────────────────────────── */
function togglePlayPause() {
  ensureAudioContext();
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

function updatePlayIcon(playing) {
  player.isPlaying = playing;
  setArtworkSpin(playing);
  const btn = document.getElementById('play-pause-btn');
  if (!btn) return;
  btn.innerHTML = playing
    ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
}

function setArtworkSpin(spin) {
  const art = document.getElementById('player-artwork');
  if (art) art.classList.toggle('spinning', spin);
}

/* ── PREV / NEXT ────────────────────────────────────────────── */
function prevTrack() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const idx = (player.currentIndex - 1 + CONFIG.tracks.length) % CONFIG.tracks.length;
  loadTrack(idx, true);
}

function nextTrack() {
  let idx;
  if (player.isShuffle) {
    idx = Math.floor(Math.random() * CONFIG.tracks.length);
  } else {
    idx = (player.currentIndex + 1) % CONFIG.tracks.length;
  }
  loadTrack(idx, true);
}

/* ── TRACK ENDED ────────────────────────────────────────────── */
function onTrackEnded() {
  if (player.isRepeat) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } else {
    nextTrack();
  }
}

/* ── TIME UPDATE ────────────────────────────────────────────── */
function onTimeUpdate() {
  if (!audio.duration) return;
  const pct = audio.currentTime / audio.duration;
  setProgressFill(pct * 100);
  setTimeDisplay('current-time', audio.currentTime);
  drawVisualizer();
}

function onMetaLoaded() {
  setTimeDisplay('total-time', audio.duration);
}

function onAudioError(e) {
  console.warn('Audio playback notice:', e);
  const nameEl = document.getElementById('player-song-name');
  if (nameEl && !nameEl.textContent) {
    const track = CONFIG.tracks[player.currentIndex];
    if (track) nameEl.textContent = track.title;
  }
  updatePlayIcon(false);
}

/* ── PROGRESS ───────────────────────────────────────────────── */
function setProgressFill(pct) {
  const fill = document.getElementById('progress-fill');
  if (fill) fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
}

function setTimeDisplay(id, seconds) {
  const el = document.getElementById(id);
  if (el) el.textContent = formatTime(seconds || 0);
}

function formatTime(s) {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m + ':' + String(sec).padStart(2, '0');
}

/* ── VOLUME / MUTE / REPEAT / SHUFFLE ───────────────────────── */
function setVolume(val) {
  player.volume = val;
  audio.volume  = val;
  localStorage.setItem('pf-volume', val);
  updateMuteIcon();
}

function toggleMute() {
  player.isMuted = !player.isMuted;
  audio.muted    = player.isMuted;
  updateMuteIcon();
}

function updateMuteIcon() {
  const btn = document.getElementById('mute-btn');
  if (!btn) return;
  if (player.isMuted || player.volume === 0) {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/><line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2"/></svg>`;
  } else {
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
  }
}

function toggleRepeat() {
  player.isRepeat = !player.isRepeat;
  const btn = document.getElementById('repeat-btn');
  if (btn) btn.classList.toggle('active', player.isRepeat);
}

function toggleShuffle() {
  player.isShuffle = !player.isShuffle;
  const btn = document.getElementById('shuffle-btn');
  if (btn) btn.classList.toggle('active', player.isShuffle);
}

/* ── AUDIO CONTEXT & VISUALIZER ─────────────────────────────── */
function ensureAudioContext() {
  if (player.audioCtx) {
    if (player.audioCtx.state === 'suspended') {
      player.audioCtx.resume().catch(() => {});
    }
    return;
  }
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    player.audioCtx = new AudioContextClass();
    if (player.audioCtx.state === 'suspended') {
      player.audioCtx.resume().catch(() => {});
    }
    player.analyser = player.audioCtx.createAnalyser();
    player.analyser.fftSize = 256;
    player.source   = player.audioCtx.createMediaElementSource(audio);
    player.source.connect(player.analyser);
    player.analyser.connect(player.audioCtx.destination);
  } catch(e) {
    // If Web Audio throws (e.g. CORS or file:// policy), normal HTML5 audio still plays fine
  }
}

function drawVisualizer() {
  const canvas = document.getElementById('visualizer-canvas');
  if (!canvas || !player.analyser) return;

  const ctx    = canvas.getContext('2d');
  const bufLen = player.analyser.frequencyBinCount;
  const data   = new Uint8Array(bufLen);
  player.analyser.getByteFrequencyData(data);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const bars    = 20;
  const barW    = (canvas.width / bars) - 1;
  const step    = Math.floor(bufLen / bars);

  for (let i = 0; i < bars; i++) {
    const val    = data[i * step] / 255;
    const barH   = val * canvas.height;
    const hue    = 320 + val * 40; // pink to lavender
    ctx.fillStyle = `hsla(${hue}, 80%, 65%, 0.85)`;
    ctx.fillRect(i * (barW + 1), canvas.height - barH, barW, barH);
  }
}

/* ══════════════════════════════════════════════════════════════
   CHAPTER OVERLAY
══════════════════════════════════════════════════════════════ */
function showChapterOverlay(index) {
  const track   = CONFIG.tracks[index];
  const overlay = document.getElementById('chapter-overlay');
  // chapter-overlay uses both class names in different HTML versions
  const content = overlay?.querySelector('.chapter-content, .chapter-overlay-content');
  if (!overlay || !track) return;

  document.getElementById('chapter-number').textContent  = 'TRACK ' + String(index + 1).padStart(2, '0');
  document.getElementById('chapter-title').textContent   = track.chapter;
  document.getElementById('chapter-message').textContent = track.message;

  // Clear theme classes
  overlay.className = '';
  overlay.id = 'chapter-overlay';
  if (track.theme) overlay.classList.add('theme-' + track.theme);

  overlay.style.display = 'flex';
  if (content) {
    content.classList.remove('show');
    requestAnimationFrame(() => requestAnimationFrame(() => content.classList.add('show')));
  }

  // Close button
  const closeBtn = document.getElementById('chapter-close');
  if (closeBtn) {
    closeBtn.onclick = () => closeChapterOverlay(true);
  }

  const listenBtn = document.getElementById('chapter-listen-btn');
  if (listenBtn) {
    listenBtn.onclick = () => closeChapterOverlay(true);
  }

  // Auto-close after 5 seconds if user doesn't interact
  setTimeout(() => {
    if (overlay.style.display === 'flex') closeChapterOverlay(true);
  }, 5500);
}

function closeChapterOverlay(andPlay) {
  const overlay = document.getElementById('chapter-overlay');
  // chapter-overlay uses both class names in different HTML versions
  const content = overlay?.querySelector('.chapter-content, .chapter-overlay-content');
  if (!overlay) return;

  if (content) content.classList.remove('show');
  setTimeout(() => {
    overlay.style.display = 'none';
    if (andPlay) {
      ensureAudioContext();
      audio.play().catch(() => {});
    }
  }, 400);
}

/* ══════════════════════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-on-scroll');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   MISS ME SECTION
══════════════════════════════════════════════════════════════ */
function initMissMe() {
  const container = document.getElementById('miss-options');
  const display   = document.getElementById('miss-display');
  if (!container || !display) return;

  container.addEventListener('click', e => {
    const btn = e.target.closest('.miss-option-btn');
    if (!btn) return;

    const index  = parseInt(btn.dataset.option, 10);
    const option = CONFIG.missMe.options[index];
    if (!option) return;

    container.querySelectorAll('.miss-option-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    display.classList.remove('visible');

    // Intimate love letter format
    display.innerHTML = `
      <div style="font-size:0.8rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--pink-light); margin-bottom:0.8rem; font-family:var(--font-serif); opacity:0.9;">💌 For Devu</div>
      <p style="margin:0; line-height:2.05;">${option.message}</p>
      <div style="text-align:right; margin-top:1.4rem; font-size:0.95rem; color:var(--lavender-light); font-family:var(--font-serif); font-style:italic;">— Always with you, Ponnu ❤️</div>
    `;

    // Force reflow then show
    void display.offsetWidth;
    display.classList.add('visible');
  });
}

/* ══════════════════════════════════════════════════════════════
   DREAM / MEETING SECTION
══════════════════════════════════════════════════════════════ */
function initDreamSection() {
  const section = document.getElementById('meeting-section');
  if (!section) return;

  const dreamLines    = section.querySelectorAll('.dream-line');
  const distanceLine  = document.getElementById('distance-memory-line');
  let   triggered     = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !triggered) {
      triggered = true;
      dreamLines.forEach((line, i) => {
        setTimeout(() => line.classList.add('revealed'), i * 600);
      });
      if (distanceLine) {
        setTimeout(() => distanceLine.classList.add('revealed'), dreamLines.length * 600 + 400);
      }
      observer.unobserve(section);
    }
  }, { threshold: 0.2 });

  observer.observe(section);
}

/* ══════════════════════════════════════════════════════════════
   FLOATING PETALS & STARS
══════════════════════════════════════════════════════════════ */
function createFloatingPetals() {
  const count = 16;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = i % 3 === 0 ? '✿' : i % 3 === 1 ? '❀' : '❤';
    p.style.left              = Math.random() * 100 + 'vw';
    p.style.fontSize          = (8 + Math.random() * 10) + 'px';
    p.style.animationDuration = (10 + Math.random() * 14) + 's';
    p.style.animationDelay    = (Math.random() * 18) + 's';
    p.style.color = i % 2 === 0
      ? 'rgba(255,107,157,0.5)'
      : 'rgba(179,157,219,0.45)';
    document.body.appendChild(p);
  }
}

function createBodyStars() {
  const count = 35;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star-particle';
    const size = Math.random() * 2 + 0.8;
    s.style.width             = size + 'px';
    s.style.height            = size + 'px';
    s.style.left              = Math.random() * 100 + 'vw';
    s.style.top               = (10 + Math.random() * 85) + 'vh';
    s.style.animationDuration = (2 + Math.random() * 4) + 's';
    s.style.animationDelay    = (Math.random() * 5) + 's';
    s.style.background        = i % 4 === 0
      ? 'rgba(179,157,219,0.9)'
      : 'rgba(255,255,255,0.8)';
    document.body.appendChild(s);
  }
}

/* ══════════════════════════════════════════════════════════════
   FINAL SECTION
══════════════════════════════════════════════════════════════ */
function initFinalSection() {
  const section = document.getElementById('final-section');
  if (!section) return;

  initFinalCanvas();
  initVoicePlayer();

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !player.finalTriggered) {
      player.finalTriggered = true;
      runFinalSequence();
      observer.unobserve(section);
    }
  }, { threshold: 0.15 });

  observer.observe(section);

  // Replay button
  const replayBtn = document.getElementById('replay-final-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', replayFinalSequence);
  }
}

/* ── FINAL CANVAS — Animated Stars + Heart Formation ───────── */
function initFinalCanvas() {
  const canvas = document.getElementById('final-stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars  = [];
  let formingHeart = false;
  let heartPositions = [];
  let raf;

  function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
    stars = buildStars(80);
    heartPositions = buildHeartPositions(80, canvas.width / 2, canvas.height / 2 - 50, 100);
  }

  function buildStars(n) {
    return Array.from({ length: n }, (_, i) => ({
      x:    Math.random() * canvas.width,
      y:    Math.random() * canvas.height,
      tx:   0, ty: 0,
      r:    Math.random() * 1.4 + 0.4,
      a:    Math.random(),
      spd:  Math.random() * 0.015 + 0.004,
      off:  Math.random() * Math.PI * 2,
    }));
  }

  function buildHeartPositions(n, cx, cy, scale) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
      pts.push({ x: cx + hx * (scale / 16), y: cy + hy * (scale / 16) });
    }
    return pts;
  }

  function draw(ts) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((s, i) => {
      if (formingHeart && heartPositions[i]) {
        s.x = lerp(s.x, heartPositions[i].x, 0.025);
        s.y = lerp(s.y, heartPositions[i].y, 0.025);
        s.r = lerp(s.r, 2.2, 0.03);
      }

      const opacity = Math.max(0.1, s.a + Math.sin(ts * s.spd + s.off) * 0.3);
      const hue = formingHeart ? 340 : 220;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = formingHeart
        ? `rgba(255,107,157,${opacity})`
        : `rgba(255,255,255,${opacity})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  raf = requestAnimationFrame(draw);
  player.finalRaf = raf;

  // Expose trigger for sequence
  window._formFinalHeart = () => { formingHeart = true; };
}

/* ── FINAL SEQUENCE ─────────────────────────────────────────── */
function runFinalSequence() {
  const steps = [
    { delay: 300,  fn: () => show('final-heading') },
    { delay: 1000, fn: () => revealTrackList() },
    { delay: 3200, fn: () => show('final-photo-frame') },
    { delay: 4400, fn: () => { show('voice-player-wrapper'); if (window._formFinalHeart) window._formFinalHeart(); } },
  ];

  steps.forEach(step => setTimeout(step.fn, step.delay));
}

function revealTrackList() {
  const items = document.querySelectorAll('#final-track-list li');
  items.forEach((li, i) => setTimeout(() => li.classList.add('show'), i * 220));
}

function show(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

/* ── FINAL MESSAGE LINES (triggered after voice or on demand) ── */
function revealFinalMessage() {
  const lines = document.querySelectorAll('.final-line');
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add('show'), i * 1000);
  });
  const totalDelay = lines.length * 1000;
  setTimeout(() => show('final-forever-text'), totalDelay + 300);
  setTimeout(() => show('final-tagline-end'),   totalDelay + 1000);
  setTimeout(() => show('replay-final-btn'),    totalDelay + 1800);
}

/* ── REPLAY ─────────────────────────────────────────────────── */
function replayFinalSequence() {
  player.finalTriggered = false;

  // Reset all final elements
  ['final-heading','final-photo-frame','voice-player-wrapper',
   'final-forever-text','final-tagline-end','replay-final-btn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  });

  document.querySelectorAll('#final-track-list li').forEach(li => li.classList.remove('show'));
  document.querySelectorAll('.final-line').forEach(l => l.classList.remove('show'));

  // Reset voice
  if (voiceAudio) {
    voiceAudio.pause();
    voiceAudio.currentTime = 0;
  }
  const vpFill = document.getElementById('voice-progress-fill');
  if (vpFill) vpFill.style.width = '0%';
  const vtEl = document.getElementById('voice-time');
  if (vtEl) vtEl.textContent = '0:00';
  updateVoiceIcon(false);

  // Re-run sequence
  player.finalTriggered = true;
  setTimeout(runFinalSequence, 400);
}

/* ══════════════════════════════════════════════════════════════
   VOICE PLAYER
══════════════════════════════════════════════════════════════ */
function initVoicePlayer() {
  if (!voiceAudio) return;

  voiceAudio.src = CONFIG.voice.file;

  const playBtn  = document.getElementById('voice-play-btn');
  const progCont = document.getElementById('voice-progress-container');
  const timeEl   = document.getElementById('voice-time');

  if (playBtn) playBtn.addEventListener('click', toggleVoicePlay);

  if (progCont) {
    progCont.addEventListener('click', e => {
      const rect = progCont.getBoundingClientRect();
      const pct  = (e.clientX - rect.left) / rect.width;
      if (voiceAudio.duration) voiceAudio.currentTime = pct * voiceAudio.duration;
    });
  }

  voiceAudio.addEventListener('timeupdate', () => {
    if (!voiceAudio.duration) return;
    const pct  = (voiceAudio.currentTime / voiceAudio.duration) * 100;
    const fill = document.getElementById('voice-progress-fill');
    if (fill) fill.style.width = pct + '%';
    if (timeEl) timeEl.textContent = formatTime(voiceAudio.currentTime) + ' / ' + formatTime(voiceAudio.duration);
  });

  voiceAudio.addEventListener('ended', () => {
    updateVoiceIcon(false);
    revealFinalMessage();
  });

  voiceAudio.addEventListener('error', (e) => {
    console.warn('Voice player audio note:', e);
  });
}

function toggleVoicePlay() {
  if (!voiceAudio) return;
  if (voiceAudio.paused) {
    voiceAudio.play().catch(() => revealFinalMessage());
    updateVoiceIcon(true);
  } else {
    voiceAudio.pause();
    updateVoiceIcon(false);
  }
}

function updateVoiceIcon(playing) {
  const btn = document.getElementById('voice-play-btn');
  if (!btn) return;
  btn.innerHTML = playing
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>`;
}

/* ══════════════════════════════════════════════════════════════
   UTILITY
══════════════════════════════════════════════════════════════ */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/* ══════════════════════════════════════════════════════════════
   VALENTINE'S GIFT SURPRISE
══════════════════════════════════════════════════════════════ */
function initValentineGift() {
  const env      = document.getElementById('wax-envelope');
  const modal    = document.getElementById('valentine-letter-modal');
  const closeBtn = document.getElementById('letter-close-btn');

  if (env && modal) {
    env.addEventListener('click', () => {
      // Spawn festive burst of hearts and roses
      for (let i = 0; i < 28; i++) {
        setTimeout(() => {
          const heart = document.createElement('div');
          heart.className = 'click-heart';
          const items = ['💖', '❤️', '🌹', '✨', '💝', '🎉', '🌸'];
          heart.textContent = items[Math.floor(Math.random() * items.length)];
          heart.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 280) + 'px';
          heart.style.top  = (window.innerHeight / 2 + (Math.random() - 0.5) * 220) + 'px';
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 1400);
        }, i * 35);
      }
      modal.style.display = 'flex';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  // Also close if tapping outside letter card
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
}
