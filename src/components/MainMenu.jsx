import { sfx } from '../utils/audio';
export function HowTo({ onBack }) {
  return (
    <div className="screen">
      <h2 className="title">How to Play</h2>
      <div className="card">
        <p><b>Jump</b> over blocks and gaps: Space, ↑, click, or tap.</p>
        <p><b>Slide</b> under barriers: ↓ or the Slide button.</p>
        <p><b>Collect coins</b> for bonus points. <b>Pause</b> with Esc.</p>
      </div>
      <button className="btn" onClick={() => { sfx.click(); onBack(); }}>Back</button>
    </div>
  );
}
export default function MainMenu({ save, onPlay, onHow, onSettings }) {
  const c = (f) => () => { sfx.click(); f(); };
  return (
    <div className="screen">
      <h1 className="logo">NEON <span>RUSH</span></h1>
      <p className="tag">Run Fast. Dodge Everything.</p>
      <div className="stats"><div><b>{save.best}</b><i>Best score</i></div><div><b>{save.coins}</b><i>Total coins</i></div></div>
      <div className="btns">
        <button className="btn primary" onClick={c(onPlay)}>Play</button>
        <button className="btn" onClick={c(onHow)}>How to Play</button>
        <button className="btn" onClick={c(onSettings)}>Settings</button>
      </div>
    </div>
  );
}
