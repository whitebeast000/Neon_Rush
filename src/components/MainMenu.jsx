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

      <section className="about">
        <h2>About Neon Rush</h2>
        <p>Neon Rush is a free endless runner that plays right in your browser, with nothing to download or install. You control a runner racing through a glowing futuristic city. The goal is simple: survive as long as you can, collect coins and beat your personal best.</p>
        <h3>How it works</h3>
        <p>Your runner moves forward automatically and gets faster the longer you survive. Jump over blocks and gaps in the road, and slide under overhead barriers. Coins appear along the path, often in arcs that reward a well-timed jump. Every run ends on your first hit, so timing matters more than speed.</p>
        <h3>Tips for a higher score</h3>
        <ul>
          <li>Start jumping a little earlier than you think you need to. The jump covers a long distance.</li>
          <li>Follow the coin arcs. They show you where to jump and where to land.</li>
          <li>Press down in mid-air to drop fast and slide as soon as you land.</li>
          <li>Stay calm as the speed rises. Every obstacle is spaced so it can always be cleared.</li>
        </ul>
        <h3>Controls</h3>
        <p>On a computer, use Space or the Up arrow to jump, the Down arrow to slide, and Esc to pause. On a phone or tablet, use the on-screen Jump and Slide buttons, or tap the screen to jump. Your best score, coins and settings are saved in your browser.</p>
        <nav className="footer-links">
          <a href="/about.html">About</a>
          <a href="/privacy.html">Privacy Policy</a>
          <a href="/contact.html">Contact</a>
        </nav>
      </section>
    </div>
  );
}