import { sfx } from '../utils/audio';
export default function PauseMenu({ onResume, onRestart, onMenu }) {
  const c = (f) => () => { sfx.click(); f(); };
  return (
    <div className="screen">
      <h2 className="title">Paused</h2>
      <div className="btns">
        <button className="btn primary" onClick={c(onResume)}>Resume</button>
        <button className="btn" onClick={c(onRestart)}>Restart</button>
        <button className="btn" onClick={c(onMenu)}>Main Menu</button>
      </div>
    </div>
  );
}
