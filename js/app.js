/* Speeka - Application Controller */

const $ = id => document.getElementById(id);

const spinBtn = $('spin');
const startBtn = $('startBtn');
const micro = $('micro');
const promptEl = $('prompt');
const practice = $('practice');
const timerScreen = $('timerScreen');
const finishScreen = $('finishScreen');
const timerWord = $('timerWord');
const clock = $('clock');
const micBtn = $('micBtn');

let currentLevel = 'Beginner';
let spinning = false;
let seconds = 120;
let currentTopicText = '';

const R_RADIUS = 148;
const CIRCUMFERENCE = 2 * Math.PI * R_RADIUS;

let running = false;
let discard = false;
let t0 = 0;
let totalSeconds = 0;
let dur = 0;
let smooth = 0;
let silStart = null;
let lastS = 0;
let levels = [];
let pauses = [];
let chunks = [];
let recorder;
let blobUrl;
let rafId;
let audioPlayer;

function updateMicUI() {
  if (stream) {
    micBtn.classList.add('on');
    micBtn.classList.remove('off');
    micBtn.title = 'Microphone Active';
  } else {
    micBtn.classList.add('off');
    micBtn.classList.remove('on');
    micBtn.title = 'Microphone Not Allowed (Click to test/grant)';
  }
}

function setWord(text, isLanding) {
  const w = $('word');
  w.className = isLanding ? 'land' : '';
  w.innerHTML = '';
  const s = document.createElement('span');
  s.textContent = text;
  w.appendChild(s);
}

function setLevel(levelKey) {
  if (spinning) return;
  currentLevel = levelKey;
  $('desc').textContent = LV[levelKey].d;
  [...$('tabs').children].forEach(b => b.classList.toggle('on', b.dataset.level === levelKey));
  
  setWord('Press space to get a topic', false);
  $('word').className = 'ph';

  promptEl.innerHTML = `<span class="shortcut-tag"><kbd>space</kbd> spin</span>`;
  currentTopicText = '';
}

function updateStartLabel() {
  startBtn.textContent = formatDuration(store.minutes);
}

function spin() {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  startBtn.disabled = true;

  const words = LV[currentLevel].w;
  const steps = 20 + Math.floor(Math.random() * 5);
  const finalObj = words[Math.floor(Math.random() * words.length)];
  const finalWord = Array.isArray(finalObj) ? finalObj[0] : finalObj;

  let i = 0;
  (function step() {
    i++;
    const last = i >= steps;
    const curObj = last ? finalObj : words[Math.floor(Math.random() * words.length)];
    const curWord = Array.isArray(curObj) ? curObj[0] : curObj;

    setWord(curWord, last);
    beep(300 + (i % 6) * 70, 0.05, 'square', 0.05);

    if (last) {
      currentTopicText = finalWord;
      spinning = false;
      spinBtn.disabled = false;
      startBtn.disabled = false;
      promptEl.innerHTML = `<span class="shortcut-tag"><kbd>space</kbd> spin</span>`;
      beep(880, 0.25, 'sine', 0.12);
      setTimeout(() => beep(1320, 0.45, 'sine', 0.12), 130);
      return;
    }
    setTimeout(step, 30 + i * i * 0.3);
  })();
}

// Modal management
function valToIndex(val) {
  let closest = 0;
  let minDiff = Infinity;
  SLIDER_STOPS.forEach((stop, i) => {
    const diff = Math.abs(stop.val - val);
    if (diff < minDiff) { minDiff = diff; closest = i; }
  });
  return closest;
}

function updateModalUI(minuteVal) {
  updateModalUIByIndex(valToIndex(minuteVal));
}

function updateModalUIByIndex(idx) {
  const stop = SLIDER_STOPS[idx];
  $('timeSlider').value = idx;
  $('timeVal').textContent = stop.label;
  [...$('chips').children].forEach((chip, i) => {
    chip.classList.toggle('on', Math.abs(OPTIONS[i].val - stop.val) < 0.01);
  });
}

function initChips() {
  const container = $('chips');
  container.innerHTML = '';
  OPTIONS.forEach(opt => {
    const c = document.createElement('button');
    c.className = 'chip';
    c.textContent = opt.label;
    c.onclick = () => updateModalUI(opt.val);
    container.appendChild(c);
  });
}

$('timeSlider').oninput = e => updateModalUIByIndex(parseInt(e.target.value));

$('gearText').onclick = () => {
  updateModalUI(store.minutes);
  $('setModal').hidden = false;
};

$('micBtn').onclick = () => {
  getAudioCtx();
  if (stream) {
    $('micNote').textContent = 'Microphone is active and permissions are granted.';
    $('allowBtn').hidden = true;
    $('denyBtn').textContent = 'Close';
    $('micModal').hidden = false;
  } else {
    $('micNote').textContent = 'Speeka listens to your volume to spot pauses longer than 1 second. Your audio stays on this device.';
    $('allowBtn').hidden = false;
    $('denyBtn').textContent = 'Not now';
    $('micModal').hidden = false;
  }
};

$('doneBtn').onclick = () => {
  const idx = parseInt($('timeSlider').value) || 0;
  store.minutes = SLIDER_STOPS[idx].val;
  save();
  updateStartLabel();
  promptEl.innerHTML = `<span class="shortcut-tag"><kbd>space</kbd> spin</span>`;
  $('setModal').hidden = true;
};

$('denyBtn').onclick = () => $('micModal').hidden = true;

$('allowBtn').onclick = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (e) {
    $('micNote').textContent = 'Microphone blocked (' + e.name + '). Please allow mic permissions in your browser.';
    return;
  }
  const a = getAudioCtx();
  const src = a.createMediaStreamSource(stream);
  analyser = a.createAnalyser();
  analyser.fftSize = 1024;
  src.connect(analyser);
  buf = new Float32Array(analyser.fftSize);
  $('allowBtn').disabled = true;
  $('micNote').textContent = 'Stay quiet for 1 second to calibrate background noise...';
  await calibrate();
  $('allowBtn').disabled = false;
  $('micModal').hidden = true;
  updateMicUI();
  beginRecording();
};

startBtn.onclick = () => {
  if (spinning) return;
  if (!currentTopicText) {
    spin();
    return;
  }
  getAudioCtx();
  if (stream) beginRecording();
  else {
    $('micNote').textContent = 'Speeka listens to your volume to spot pauses longer than 1 second. Your audio stays on this device.';
    $('allowBtn').hidden = false;
    $('denyBtn').textContent = 'Not now';
    $('micModal').hidden = false;
  }
};

function updateTimerDisplay() {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  clock.textContent = `${m}:${s}`;
  
  const arc = $('arc');
  if (arc) {
    arc.style.strokeDasharray = CIRCUMFERENCE;
    const progress = totalSeconds > 0 ? (seconds / totalSeconds) : 1;
    arc.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  }
}

function renderPhrasePills() {
  const container = $('phrasePills');
  container.innerHTML = '';
  if (currentLevel === 'Beginner') {
    const shuffled = BRIDGE.slice().sort(() => Math.random() - .5).slice(0, 4);
    shuffled.forEach(phrase => {
      const pill = document.createElement('div');
      pill.className = 'phrase-pill';
      pill.textContent = phrase;
      container.appendChild(pill);
    });
  }
}

function beginRecording() {
  timerWord.textContent = currentTopicText;
  totalSeconds = Math.round(store.minutes * 60);
  seconds = totalSeconds;
  renderPhrasePills();
  timerScreen.hidden = false;
  updateTimerDisplay();

  levels = []; pauses = []; chunks = []; silStart = null; smooth = 0; lastS = 0; discard = false;
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = e => chunks.push(e.data);
  recorder.onstop = () => {
    if (!discard) {
      blobUrl = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }));
      showReportScreen();
    }
  };
  recorder.start();
  t0 = performance.now();
  running = true;
  loopRecording();
}

function loopRecording() {
  if (!running) return;
  const now = (performance.now() - t0) / 1000;
  const left = Math.max(0, totalSeconds - now);
  seconds = Math.ceil(left);
  updateTimerDisplay();

  smooth = smooth * .7 + rms() * .3;
  if (now - lastS >= .1) {
    levels.push(smooth);
    lastS = now;
  }

  let silent = false;
  if (smooth > thr) {
    if (silStart !== null) {
      const d = now - silStart;
      if (d > 1) pauses.push({ s: silStart, d });
      silStart = null;
    }
  } else {
    if (silStart === null) silStart = now;
    silent = (now - silStart > 1);
  }

  timerScreen.classList.toggle('silent', silent);

  if (left <= 0) {
    finishRecording();
    return;
  }
  rafId = requestAnimationFrame(loopRecording);
}

function finishRecording() {
  if (!running) return;
  running = false;
  dur = Math.min(totalSeconds, (performance.now() - t0) / 1000);
  if (silStart !== null && dur - silStart > 1) pauses.push({ s: silStart, d: dur - silStart });

  const k = key(new Date());
  const r = store.days[k] || { s: 0, n: 0 };
  r.s += dur; r.n += 1;
  store.days[k] = r;
  save();

  recorder.stop();
  timerScreen.hidden = true;
}

function cancelTimer() {
  running = false;
  discard = true;
  timerScreen.classList.remove('silent');
  if (recorder && recorder.state !== 'inactive') {
    recorder.stop();
  }
  timerScreen.hidden = true;
}

$('cancelBtn').onclick = cancelTimer;

function showReportScreen() {
  finishScreen.hidden = false;
  timerScreen.classList.remove('silent');
  
  const pt = pauses.reduce((a, p) => a + p.d, 0);
  const lg = pauses.reduce((a, p) => Math.max(a, p.d), 0);
  $('n1').textContent = pauses.length;
  $('n2').textContent = lg ? lg.toFixed(1) + 's' : '0s';
  $('n3').textContent = Math.round((1 - pt / Math.max(1, dur)) * 100) + '%';

  // Render Waveform Canvas
  const box = $('wave');
  const cv = $('cv');
  const dpr = window.devicePixelRatio || 1;
  const w = box.clientWidth;
  const h = box.clientHeight;
  cv.width = w * dpr;
  cv.height = h * dpr;
  const g = cv.getContext('2d');
  g.scale(dpr, dpr);

  g.fillStyle = '#171918';
  const bars = Math.floor(w / 4);
  const peak = Math.max(0.05, ...levels);

  for (let i = 0; i < bars; i++) {
    let m = 0;
    const a = Math.floor(i / bars * levels.length);
    const b = Math.max(a + 1, Math.floor((i + 1) / bars * levels.length));
    for (let j = a; j < b; j++) m = Math.max(m, levels[j] || 0);
    const bh = Math.max(2, m / peak * (h - 12));
    g.fillRect(i * 4, (h - bh) / 2, 2.5, bh);
  }

  box.querySelectorAll('.p').forEach(e => e.remove());
  pauses.forEach(p => {
    const d = document.createElement('div');
    d.className = 'p';
    d.style.left = (p.s / dur * 100) + '%';
    d.style.width = (p.d / dur * 100) + '%';
    d.dataset.d = p.d.toFixed(1) + 's pause';
    box.appendChild(d);
  });

  if (audioPlayer) audioPlayer.pause();
  audioPlayer = new Audio(blobUrl);
  $('play').innerHTML = PLAY_SVG;
  $('ph').style.left = '0';
  audioPlayer.ontimeupdate = () => $('ph').style.left = Math.min(100, audioPlayer.currentTime / dur * 100) + '%';
  audioPlayer.onended = () => { $('play').innerHTML = PLAY_SVG; $('ph').style.left = '0'; };

  renderHeatmap();
}

$('play').onclick = () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    $('play').innerHTML = PAUSE_SVG;
  } else {
    audioPlayer.pause();
    $('play').innerHTML = PLAY_SVG;
  }
};

$('wave').onclick = e => {
  const r = $('wave').getBoundingClientRect();
  audioPlayer.currentTime = (e.clientX - r.left) / r.width * dur;
};

$('againBtn').onclick = () => {
  if (audioPlayer) audioPlayer.pause();
  finishScreen.hidden = true;
  spin();
};

document.querySelectorAll("#rating button").forEach(b => {
  b.onclick = () => {
    document.querySelectorAll("#rating button").forEach(x => x.classList.remove("active"));
    b.classList.add("active");
  };
});

function renderHeatmap() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { streak, totalActiveDays } = getStreakData();
  $('streak').textContent = '🔥 ' + streak + ' day streak';
  
  const allSeconds = Object.values(store.days).reduce((a, r) => a + r.s, 0);
  const totalMins = Math.round(allSeconds / 60);
  $('tot').innerHTML = `<span>Active days: <b>${totalActiveDays}</b></span> &nbsp;•&nbsp; <span>Total time: <b>${totalMins} min</b></span>`;

  const container = $('months-container');
  container.innerHTML = '';

  const numMonths = 6;
  for (let m = numMonths - 1; m >= 0; m--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - m, 1);
    const monthYear = monthDate.getFullYear();
    const monthIndex = monthDate.getMonth();
    const monthName = monthDate.toLocaleString('default', { month: 'short' });
    const daysInMonth = new Date(monthYear, monthIndex + 1, 0).getDate();
    
    let startDay = new Date(monthYear, monthIndex, 1).getDay();
    let firstOffset = (startDay + 6) % 7;
    
    const totalSlots = firstOffset + daysInMonth;
    const numCols = Math.ceil(totalSlots / 7);

    const monthGroup = document.createElement('div');
    monthGroup.className = 'lc-month-group';

    const grid = document.createElement('div');
    grid.className = 'lc-month-grid';
    grid.style.gridTemplateColumns = `repeat(${numCols}, 12px)`;

    for (let slot = 0; slot < numCols * 7; slot++) {
      const dayNum = slot - firstOffset + 1;
      const c = document.createElement('i');
      if (dayNum >= 1 && dayNum <= daysInMonth) {
        const d = new Date(monthYear, monthIndex, dayNum);
        const k = key(d);
        const rec = store.days[k];
        const sec = rec ? rec.s : 0;
        const mVal = sec / 60;
        const lv = !rec ? 0 : mVal < 2 ? 1 : mVal < 5 ? 2 : mVal < 10 ? 3 : 4;
        
        c.className = 'l' + lv;
        if (d > today) c.style.visibility = 'hidden';
        c.title = k + ': ' + (rec ? (Math.round(mVal * 10) / 10) + ' min, ' + rec.n + ' session(s)' : 'no practice');
      } else {
        c.className = 'empty';
      }
      grid.appendChild(c);
    }

    const lbl = document.createElement('div');
    lbl.className = 'lc-month-label';
    lbl.textContent = monthName;

    monthGroup.appendChild(grid);
    monthGroup.appendChild(lbl);
    container.appendChild(monthGroup);
  }
}

// Keyboard shortcuts
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !e.repeat && timerScreen.hidden && finishScreen.hidden && $('setModal').hidden && $('micModal').hidden) {
    e.preventDefault();
    spin();
  }
  if (e.code === "Escape") {
    $('setModal').hidden = true;
    $('micModal').hidden = true;
    if (!timerScreen.hidden) cancelTimer();
  }
});

// Init Level tabs
['Beginner', 'Intermediate', 'Advanced'].forEach(levelKey => {
  const btn = document.createElement('button');
  btn.textContent = levelKey;
  btn.dataset.level = levelKey;
  btn.onclick = () => setLevel(levelKey);
  $('tabs').appendChild(btn);
});

spinBtn.onclick = spin;

initChips();
setLevel('Beginner');
updateStartLabel();
updateMicUI();
