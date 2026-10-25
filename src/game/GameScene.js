import Phaser from 'phaser';
import { W, H, GROUND, X, C } from './gameConfig';
import Player from './Player';
import { load } from '../utils/storage';
import { sfx } from '../utils/audio';

// States: menu -> play <-> paused -> over -> (play | menu). React drives them via bus 'cmd'.
export default class GameScene extends Phaser.Scene {
  constructor(bus) { super('Game'); this.bus = bus; }

  create() {
    const mk = this.make.graphics({ add: false });
    const city = (key, col, win, a, b) => {
      mk.clear(); let x = 0;
      while (x < 512) {
        const w = Phaser.Math.Between(34, 80), h = Phaser.Math.Between(a, b);
        mk.fillStyle(col).fillRect(x, 300 - h, w, h);
        if (win) { mk.fillStyle(win, 0.55); for (let k = 0; k < 6; k++) mk.fillRect(x + 6 + (k % 2) * 18, 300 - h + 12 + Math.floor(k / 2) * 24, 5, 5); }
        x += w + 6;
      }
      mk.generateTexture(key, 512, 300);
    };
    city('far', 0x10103a, 0, 90, 230); city('near', 0x1a1250, C.cyan, 70, 170);
    mk.clear().fillStyle(0x0b0a2a).fillRect(0, 0, 64, H - GROUND).lineStyle(1, C.purple, 0.5).lineBetween(0, 0, 0, H - GROUND);
    for (let y = 24; y < H - GROUND; y += 24) mk.lineBetween(0, y, 64, y);
    mk.generateTexture('floor', 64, H - GROUND); mk.destroy();

    this.add.rectangle(W / 2, H / 2, W, H, 0x07071a).setDepth(0);
    this.add.circle(W * 0.72, 190, 110, C.pink, 0.16).setDepth(0.5);
    this.add.circle(W * 0.72, 190, 70, C.purple, 0.25).setDepth(0.5);
    this.stars = Array.from({ length: 45 }, () => this.add.rectangle(Math.random() * W, Math.random() * 300, 2, 2, 0xffffff, Math.random() * 0.6 + 0.2).setDepth(0.6));
    this.far = this.add.tileSprite(0, GROUND - 300, W, 300, 'far').setOrigin(0).setDepth(1);
    this.near = this.add.tileSprite(0, GROUND - 300, W, 300, 'near').setOrigin(0).setDepth(2);
    this.floor = this.add.tileSprite(0, GROUND, W, H - GROUND, 'floor').setOrigin(0).setDepth(3);
    this.add.rectangle(0, GROUND - 4, W, 10, C.cyan, 0.2).setOrigin(0).setDepth(3.4);
    this.add.rectangle(0, GROUND, W, 3, C.cyan).setOrigin(0).setDepth(3.5);

    this.obs = []; this.coinsArr = []; this.pulse = 1; this.state = 'menu';
    this.player = new Player(this);
    this.reset();

    this.kd = (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
      if (e.repeat) return;
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) this.doJump();
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.doSlide();
    };
    this.onCmd = (c) => {
      if (c === 'start') { this.reset(); this.state = 'play'; }
      else if (c === 'pause' && this.state === 'play') this.state = 'paused';
      else if (c === 'resume' && this.state === 'paused') this.state = 'play';
      else if (c === 'menu') { this.reset(); this.state = 'menu'; }
    };
    window.addEventListener('keydown', this.kd);
    this.input.on('pointerdown', this.doJump, this);
    this.bus.on('jump', this.doJump, this); this.bus.on('slide', this.doSlide, this); this.bus.on('cmd', this.onCmd, this);
    this.events.once('shutdown', this.cleanup, this); this.events.once('destroy', this.cleanup, this);
  }

  cleanup() {
    window.removeEventListener('keydown', this.kd);
    this.bus.off('jump', this.doJump, this); this.bus.off('slide', this.doSlide, this); this.bus.off('cmd', this.onCmd, this);
  }

  doJump() { if (this.state === 'play' && this.player.jump()) sfx.jump(); }
  doSlide() { if (this.state === 'play' && this.player.duck()) sfx.slide(); }
  score() { return Math.floor(this.dist * 5) + this.coins * 25; }
  emitHud() { this.bus.emit('hud', { score: this.score(), dist: Math.floor(this.dist), coins: this.coins }); }

  reset() {
    this.obs.forEach((o) => o.go.destroy());
    this.coinsArr.forEach((c) => { c.go.destroy(); c.gl.destroy(); });
    this.obs = []; this.coinsArr = [];
    this.t = 0; this.dist = 0; this.coins = 0; this.speed = 340; this.spawnT = 1.2; this.hudT = 0;
    this.overTimer?.remove(false);
    this.stars.forEach((s) => s.setVisible(!load().reduced));
    this.player.reset(); this.emitHud();
  }

  burst(x, y, col, n) {
    if (load().reduced) return;
    for (let i = 0; i < n; i++) {
      const c = this.add.circle(x, y, 3, col).setDepth(8), a = Math.random() * 6.28, d = 30 + Math.random() * 40;
      this.tweens.add({ targets: c, x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, alpha: 0, scale: 0.2, duration: 400, onComplete: () => c.destroy() });
    }
  }

  addCoin(x, y) {
    const gl = this.add.circle(x, y, 18, C.gold, 0.25).setDepth(5);
    const go = this.add.circle(x, y, 10, C.gold).setStrokeStyle(2, 0xfff2a0).setDepth(5);
    this.coinsArr.push({ x, y, go, gl });
  }

  spawn() {
    const t = this.t, x = W + 60, pool = ['block'];
    if (t > 6) pool.push('bar');
    if (t > 12) pool.push('gap');
    if (t > 25) pool.push('wide');
    const type = Phaser.Utils.Array.GetRandom(pool), o = { type, x, w: 40, h: 50, y: 0 };
    if (type === 'block') { o.w = Phaser.Math.Between(34, 46); o.h = Phaser.Math.Between(40, 70); o.y = GROUND - o.h; }
    if (type === 'wide') { o.w = 96; o.h = 48; o.y = GROUND - 48; }
    if (type === 'bar') { o.w = 80; o.h = 135; o.y = GROUND - 175; }
    if (type === 'gap') { o.w = Math.round(100 + this.speed * 0.12); o.h = H - GROUND; o.y = GROUND; }
    o.go = type === 'gap'
      ? this.add.rectangle(x, o.y, o.w, o.h, 0x02020a).setOrigin(0).setStrokeStyle(2, C.pink).setDepth(4)
      : this.add.rectangle(x, o.y, o.w, o.h, type === 'bar' ? C.pink : 0x2b0b55, type === 'bar' ? 0.3 : 1).setOrigin(0).setStrokeStyle(2, C.pink).setDepth(5);
    this.obs.push(o);
    // Spacing leaves >= ~0.95s of travel between obstacles, so every pattern is fair.
    const lo = Math.max(0.95, 1.45 - t * 0.006);
    this.spawnT = Phaser.Math.FloatBetween(lo, lo + 0.5);
    const L = this.speed * this.spawnT;
    if (type === 'bar') for (let i = 0; i < 4; i++) this.addCoin(x + 10 + i * 34, GROUND - 20);
    else {
      const hh = Math.min(110, type === 'gap' ? 100 : o.h + 40);
      for (let i = 0; i < 5; i++) { const u = (i - 2) / 2; this.addCoin(x + o.w / 2 + (i - 2) * 46, GROUND - 34 - (1 - u * u) * hh); }
    }
    if (type !== 'gap') {
      const sx = Math.max(x + o.w + 30, x + L / 2 - 72);
      if (sx + 108 < x + L - 30) for (let i = 0; i < 4; i++) this.addCoin(sx + i * 36, GROUND - 20);
    }
  }

  die() {
    if (this.state !== 'play') return;
    this.state = 'over'; sfx.hit(); this.burst(X, Math.min(this.player.y, GROUND) - 28, C.pink, 16);
    if (!load().reduced) { this.cameras.main.shake(250, 0.012); this.cameras.main.flash(180, 255, 40, 120); }
    this.player.g.setAlpha(0.4); this.emitHud();
    this.overTimer = this.time.delayedCall(650, () => {
      sfx.over(); this.bus.emit('over', { score: this.score(), dist: Math.floor(this.dist), coins: this.coins });
    });
  }

  update(time, delta) {
    const dt = Math.min(delta, 50) / 1000, st = this.state, p = this.player;
    const sp = st === 'play' ? this.speed : st === 'menu' ? 150 : 0;
    this.far.tilePositionX += sp * dt * 0.12; this.near.tilePositionX += sp * dt * 0.3; this.floor.tilePositionX += sp * dt;
    this.stars.forEach((s) => { s.x -= sp * dt * 0.05; if (s.x < 0) s.x = W; });
    if (st === 'menu') { p.t += dt; p.draw(); return; }
    if (st !== 'play') return;

    this.t += dt; this.speed = Math.min(720, 340 + this.t * 5.5); this.dist += (this.speed * dt) / 40;
    p.t += (dt * this.speed) / 340; this.pulse = 1 + Math.sin(time / 160) * 0.15;
    if ((this.spawnT -= dt) <= 0) this.spawn();
    const dx = this.speed * dt;
    for (let i = this.obs.length - 1; i >= 0; i--) {
      const o = this.obs[i]; o.x -= dx; o.go.x = o.x;
      if (o.x + o.w < -60) { o.go.destroy(); this.obs.splice(i, 1); }
    }
    const pit = this.obs.some((o) => o.type === 'gap' && X > o.x + 12 && X < o.x + o.w - 12);
    p.update(dt, pit);
    const b = p.hitbox();
    for (const o of this.obs) {
      if (o.type !== 'gap' && b.r > o.x + 3 && b.l < o.x + o.w - 3 && b.b > o.y + 3 && b.t < o.y + o.h - 3) { p.draw(); return this.die(); }
    }
    if (p.y > GROUND + 90) return this.die();

    const cy = p.y - 26;
    for (let i = this.coinsArr.length - 1; i >= 0; i--) {
      const c = this.coinsArr[i]; c.x -= dx; c.go.x = c.gl.x = c.x; c.gl.setScale(this.pulse);
      const got = Math.hypot(c.x - X, c.y - cy) < 32;
      if (got) { this.coins++; this.burst(c.x, c.y, C.gold, 6); sfx.coin(); }
      if (got || c.x < -30) { c.go.destroy(); c.gl.destroy(); this.coinsArr.splice(i, 1); }
    }
    p.draw();
    if ((this.hudT += dt) > 0.08) { this.hudT = 0; this.emitHud(); }
  }
}
