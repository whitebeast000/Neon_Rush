import { sfx } from '../utils/audio';
export default function Settings({ settings, onChange, onBack }) {
  const row = (k, label) => (
    <button className={'toggle' + (settings[k] ? ' on' : '')} onClick={() => { onChange(k, !settings[k]); sfx.click(); }}>
      <span>{label}</span><em>{settings[k] ? 'ON' : 'OFF'}</em>
    </button>
  );
  return (
    <div className="screen">
      <h2 className="title">Settings</h2>
      <div className="btns">{row('sfx', 'Sound effects')}{row('reduced', 'Reduced effects')}</div>
      <button className="btn" onClick={() => { sfx.click(); onBack(); }}>Back</button>
    </div>
  );
}
