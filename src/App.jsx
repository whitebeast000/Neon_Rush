import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { makeConfig } from './game/gameConfig';
import GameScene from './game/GameScene';
import { load, save } from './utils/storage';
import MainMenu, { HowTo } from './components/MainMenu';
import Settings from './components/Settings';
import GameHUD from './components/GameHUD';
import PauseMenu from './components/PauseMenu';
import GameOver from './components/GameOver';

const bus = new Phaser.Events.EventEmitter();

export default function App() {
  const host = useRef(null);
  const [screen, setScreen] = useState('menu'); // menu | play | paused | over
  const [panel, setPanel] = useState(null); // how | settings
  const [hud, setHud] = useState({ score: 0, dist: 0, coins: 0 });
  const [res, setRes] = useState(null);
  const [data, setData] = useState(load());
  const screenRef = useRef(screen); screenRef.current = screen;

  useEffect(() => {
    const game = new Phaser.Game(makeConfig(host.current, new GameScene(bus)));
    const onHud = (h) => setHud(h);
    const onOver = (r) => {
      const prev = load().best, best = Math.max(prev, r.score);
      setData(save({ best, coins: load().coins + r.coins }));
      setRes({ ...r, best, isNew: r.score > prev });
      setScreen('over');
    };
    const onKey = (e) => {
      if (e.code !== 'Escape') return;
      if (screenRef.current === 'play') { bus.emit('cmd', 'pause'); setScreen('paused'); }
      else if (screenRef.current === 'paused') { bus.emit('cmd', 'resume'); setScreen('play'); }
    };
    bus.on('hud', onHud); bus.on('over', onOver); window.addEventListener('keydown', onKey);
    return () => { bus.off('hud', onHud); bus.off('over', onOver); window.removeEventListener('keydown', onKey); game.destroy(true); };
  }, []);

  const start = () => { bus.emit('cmd', 'start'); setPanel(null); setScreen('play'); };
  const pause = () => { bus.emit('cmd', 'pause'); setScreen('paused'); };
  const resume = () => { bus.emit('cmd', 'resume'); setScreen('play'); };
  const menu = () => {
    if (screen === 'paused') setData(save({ coins: load().coins + hud.coins, best: Math.max(load().best, hud.score) }));
    bus.emit('cmd', 'menu'); setPanel(null); setScreen('menu');
  };
  const tap = (ev) => (e) => { e.preventDefault(); bus.emit(ev); };

  return (
    <div className="app">
      <div ref={host} className="stage" />
      {screen === 'play' && (
        <>
          <GameHUD hud={hud} best={data.best} onPause={pause} />
          <div className="touch">
            <button className="tbtn" onPointerDown={tap('slide')}>SLIDE</button>
            <button className="tbtn jump" onPointerDown={tap('jump')}>JUMP</button>
          </div>
        </>
      )}
      {screen === 'menu' && !panel && <MainMenu save={data} onPlay={start} onHow={() => setPanel('how')} onSettings={() => setPanel('settings')} />}
      {screen === 'menu' && panel === 'how' && <HowTo onBack={() => setPanel(null)} />}
      {screen === 'menu' && panel === 'settings' && <Settings settings={data} onChange={(k, v) => setData(save({ [k]: v }))} onBack={() => setPanel(null)} />}
      {screen === 'paused' && <PauseMenu onResume={resume} onRestart={start} onMenu={menu} />}
      {screen === 'over' && res && <GameOver res={res} onAgain={start} onMenu={menu} />}
    </div>
  );
}
