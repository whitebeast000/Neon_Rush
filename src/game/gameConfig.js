import Phaser from 'phaser';
export const W = 960, H = 540, GROUND = 420, X = 170, GRAV = 2300, JUMP = -860;
export const C = { cyan: 0x22d3ee, pink: 0xff2bd6, blue: 0x4f6bff, purple: 0x8b3dff, gold: 0xffd23f };
export const makeConfig = (parent, scene) => ({
  type: Phaser.AUTO, parent, width: W, height: H, backgroundColor: '#07071a', scene,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  render: { antialias: true, powerPreference: 'low-power' },
});
