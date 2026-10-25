import { sfx } from '../utils/audio';
export default function GameOver({ res, onAgain, onMenu }) {
  const c = (f) => () => { sfx.click(); f(); };
  return (
    <div className="screen">
      <h2 className="title over">RUN OVER</h2>
      {res.isNew && <div className="badge">★ NEW PERSONAL BEST ★</div>}
      <div className="stats">
        <div><b>{res.score}</b><i>Score</i></div><div><b>{res.best}</b><i>Best</i></div>
        <div><b>{res.dist}m</b><i>Distance</i></div><div><b>{res.coins}</b><i>Coins this run</i></div>
      </div>
      <div className="btns">
        <button className="btn primary" onClick={c(onAgain)}>Play Again</button>
        <button className="btn" onClick={c(onMenu)}>Main Menu</button>
      </div>
    </div>
  );
}
