import { canvas } from '../ui/canvas.js';
import bus from '../bus.js';

function Plank(x, y, angle) {
  let anim = 0;
  let stuckInMouth = false;
  let releaseTimer = 0;
  let remove = false;
  let ripple = 0;
  let vx = 0;
  let vy = 0;
  let omega = 0;

  bus.on('boom', onBoom);

  function update(state, dT) {
    // Chomp physics
    const mx = state.shark.getJawX();
    const my = state.shark.getJawY();
    const dx = mx - x;
    const dy = my - y;
    if (state.shark.canCatchInMouth() && releaseTimer <= 0 && dx * dx + dy * dy < 600) {
      stuckInMouth = true;
      state.shark.fillMouth(this);
    }
    if (releaseTimer > 0) {
      releaseTimer -= dT;
    }

    // Motion physics
    if (!stuckInMouth) {
      vy += 10 * dT;
      vx -= vx * 2 * dT;
      vy -= vy * 2 * dT;
      x += vx * dT;
      y += vy * dT;
      angle += omega * dT;
      omega -= (omega + (Math.random() - 0.5) * 3) * dT;
    } else {
      x = mx;
      y = my;
      angle = state.shark.getHeading();
    }

    // Boundary physics
    const leftLimit = state.level.levelMapLeft(y);
    const rightLimit = state.level.levelMapRight(y);
    const bottomLimit = state.level.getProgress();
    if (x < leftLimit + 20) {
      x = leftLimit + 20;
    }
    if (x > rightLimit - 20) {
      x = rightLimit - 20;
    }
    if (y > bottomLimit + 50) {
      remove = true;
    }

    // Ripple animator
    ripple += dT;
    if (ripple > 0.5) {
      const rippleDir = Math.random() * 6.28;
      const px = x + Math.cos(angle + rippleDir) * 30;
      const py = y + Math.sin(angle + rippleDir) * 4;
      bus.emit('ripple', {
        x: px, y: py,
        size: 20 + Math.random() * 10,
        direction: rippleDir,
        duration: 2,
      });
      ripple = 0;
    }
  }

  function render(ctx) {
    const baseXfm = ctx.getTransform();
    ctx.translate(x, y);
    ctx.rotate(angle);

    const xfm = ctx.getTransform();
    ctx.fillStyle = '#753';
    ctx.fillRect(-45, -8, 90, 16);
    ctx.fillStyle = '#222';
    ctx.fillRect(-42, -5, 4, 4);
    ctx.fillRect(-42, 1, 4, 4);
    ctx.fillRect(38, -5, 4, 4);
    ctx.fillRect(38, 1, 4, 4);

    ctx.setTransform(baseXfm);
  }

  function onBoom(obj) {
    const dx = obj.x - x;
    const dy = obj.y - y;
    if (dx * dx + dy * dy < 250 * 250) {
      remove = true;
    }
  }

  function getX() {
    return x;
  }

  function getY() {
    return y;
  }

  function release(dvx, dvy) {
    stuckInMouth = false;
    releaseTimer = 1.5;
    vx += dvx;
    vy += dvy;
    omega = (Math.random() - 0.5) * 5;
  }

  function crush() {
    release(0, 0);
    remove = true;
  }

  function shouldRemove() {
    if (remove) {
      bus.off('boom', onBoom);
    }
    return remove;
  }

  return {
    update,
    render,
    shouldRemove,
    release,
    crush,
    getX,
    getY,
  };
};

export default Plank;
