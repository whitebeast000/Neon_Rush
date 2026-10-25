import { load } from './storage';
let ac;
function beep(f, d = 0.1, type = 'square', v = 0.05, to) {
  if (!load().sfx) return;
  try {
    ac ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === 'suspended') ac.resume();
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + d);
  } catch { /* audio unavailable */ }
}
export const sfx = {
  click: () => beep(600, 0.06, 'triangle'),
  jump: () => beep(300, 0.18, 'square', 0.04, 700),
  slide: () => beep(400, 0.15, 'sawtooth', 0.03, 150),
  coin: () => { beep(900, 0.07, 'triangle'); setTimeout(() => beep(1300, 0.1, 'triangle'), 60); },
  hit: () => beep(160, 0.35, 'sawtooth', 0.08, 40),
  over: () => beep(330, 0.5, 'triangle', 0.06, 90),
};
