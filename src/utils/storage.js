const KEY = 'neonrush:v1';
const defaults = { best: 0, coins: 0, sfx: true, reduced: false };
let data = null;
export const load = () => {
  if (!data) {
    try { data = { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; }
    catch { data = { ...defaults }; }
  }
  return data;
};
export const save = (patch) => {
  data = { ...load(), ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* storage blocked */ }
  return data;
};
