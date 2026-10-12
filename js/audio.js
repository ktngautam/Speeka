/* Speeka - Web Audio & Microphone Handler */

const PLAY_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>';
const PAUSE_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';

let audioCtx;
function getAudioCtx() {
  audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function beep(freq = 500, dur = 0.05, type = 'square', vol = 0.05) {
  try {
    const a = getAudioCtx();
    const o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    o.connect(g);
    g.connect(a.destination);
    o.start();
    o.stop(a.currentTime + dur);
  } catch (e) {}
}

let stream, analyser, buf, thr = 0.012;

function rms() {
  if (!analyser || !buf) return 0;
  analyser.getFloatTimeDomainData(buf);
  let s = 0;
  for (const v of buf) s += v * v;
  return Math.sqrt(s / buf.length);
}

function calibrate() {
  return new Promise(r => {
    let s = 0, n = 0;
    const t = performance.now();
    (function f() {
      s += rms();
      n++;
      if (performance.now() - t < 1000) requestAnimationFrame(f);
      else {
        thr = Math.max(0.01, (s / n) * 3);
        r();
      }
    })();
  });
}
