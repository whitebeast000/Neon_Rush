import { Pause } from 'lucide-react';
export default function GameHUD({ hud, best, onPause }) {
  return (
    <div className="hud">
      <div className="pill"><i>SCORE</i><b>{hud.score}</b></div>
      <div className="pill"><i>DIST</i><b>{hud.dist}m</b></div>
      <div className="pill gold"><i>COINS</i><b>{hud.coins}</b></div>
      <div className="pill best"><i>BEST</i><b>{Math.max(best, hud.score)}</b></div>
      <button className="pause" aria-label="Pause" onClick={(e) => { e.currentTarget.blur(); onPause(); }}><Pause size={20} /></button>
    </div>
  );
}
