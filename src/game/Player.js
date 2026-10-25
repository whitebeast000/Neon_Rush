import { X, GROUND, GRAV, JUMP, C } from './gameConfig';
export default class Player {
  constructor(scene) {
    this.g = scene.add.graphics().setDepth(6);
    this.sh = scene.add.ellipse(X, GROUND + 5, 44, 9, 0x000000, 0.55).setDepth(5);
    this.reset();
  }
  reset() {
    this.y = GROUND; this.vy = 0; this.slide = 0; this.fall = false; this.sq = 0; this.t = 0; this.want = false;
    this.g.setAlpha(1); this.draw();
  }
  get air() { return this.y < GROUND - 1; }
  jump() { if (this.air || this.fall) return false; this.vy = JUMP; this.slide = 0; this.y -= 1; return true; }
  duck() {
    if (this.fall) return false;
    if (this.air) { this.vy = Math.max(this.vy, 1000); this.want = true; return false; }
    this.slide = 0.7; return true;
  }
  update(dt, pit) {
    const was = this.air || this.fall;
    this.slide = Math.max(0, this.slide - dt);
    this.vy += GRAV * dt; this.y += this.vy * dt;
    if (this.y >= GROUND) {
      if (pit || this.fall) this.fall = true;
      else {
        this.y = GROUND; this.vy = 0;
        if (was) { this.sq = 0.2; if (this.want) { this.slide = 0.6; this.want = false; } return 'land'; }
      }
    }
    return null;
  }
  hitbox() {
    const h = this.slide > 0 && !this.air ? 26 : 52;
    return { l: X - 11, r: X + 11, t: this.y - h + 3, b: this.y - 2 };
  }
  draw() {
    const g = this.g, air = this.air || this.fall;
    this.sq = Math.max(0, this.sq - 0.02);
    g.clear().setPosition(X, this.y).setScale(1 + this.sq, 1 - this.sq);
    this.sh.setPosition(X, GROUND + 5).setScale(Math.max(0.3, 1 - (GROUND - this.y) / 220)).setVisible(!this.fall);
    if (this.slide > 0 && !air) {
      g.fillStyle(C.cyan, 0.18).fillRoundedRect(-28, -32, 56, 32, 12);
      g.fillStyle(C.cyan).fillRoundedRect(-24, -26, 48, 22, 9);
      g.fillStyle(C.pink).fillRoundedRect(8, -21, 14, 7, 3);
      g.lineStyle(2, C.cyan, 0.5).lineBetween(-46, -18, -30, -18).lineBetween(-50, -10, -30, -10);
    } else {
      const sw = air ? 0 : Math.sin(this.t * 16) * 13;
      g.lineStyle(7, C.blue);
      if (air) g.lineBetween(-5, -24, -12, -10).lineBetween(5, -24, 12, -12);
      else g.lineBetween(-5, -24, -5 + sw, -2).lineBetween(5, -24, 5 - sw, -2);
      g.fillStyle(C.cyan, 0.18).fillRoundedRect(-19, -61, 38, 44, 12);
      g.fillStyle(C.cyan).fillRoundedRect(-14, -56, 28, 36, 9);
      g.fillStyle(C.pink).fillRoundedRect(0, -48, 15, 9, 4);
    }
  }
}
