import { canvas } from '../ui/canvas.js';
import bus from '../bus.js';

function DrownMan(x, y, angle, vx, vy) {
  let anim = 0;
  let stuckInMouth = false;
  let releaseTimer = 0;
  let remove = false;
  let ripple = 0;
  let omega = (Math.random() - 0.5) * 3;
  let vz = -15;
  let z = 0;
  let inAir = true;

  bus.on('boom', onBoom);

  function update(state, dT) {
    anim += dT;

    // Boundary physics
    const leftLimit = state.level.levelMapLeft(y);
    const rightLimit = state.level.levelMapRight(y);
    const bottomLimit = state.level.getProgress();
    if (x < leftLimit + 20) {
      x = leftLimit + 20;
      vx = -vx;
    }
    if (x > rightLimit - 20) {
      x = rightLimit - 20;
      vx = -vx;
    }

    // Air physics
    if (inAir) {
      vz += 30 * dT;
      x += vx * dT;
      y += vy * dT;
      z += vz * dT;
      angle += omega * dT;
      if (z > 0 && vz > 0) {
        inAir = false;
        z = 0;
        bus.emit('splash');
      }
      return;
    }

    // Chomp physics
    const mx = state.shark.getJawX();
    const my = state.shark.getJawY();
    const dx = mx - x;
    const dy = my - y;
    if (state.shark.canCatchInMouth() && releaseTimer <= 0 && dx * dx + dy * dy < 850) {
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
      omega -= (omega + (Math.random() - 0.5) * 10) * dT;
    } else {
      x = mx;
      y = my;
      angle = state.shark.getHeading();
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
      if (stuckInMouth) {
        bus.emit('blood', { x, y, n: 3 });
      }
      ripple = 0;
    }
  }

  function render(ctx) {
    const baseXfm = ctx.getTransform();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.scale(0.8 - z * 0.2, 0.8 - z * 0.2);

    const xfm = ctx.getTransform();
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(0, -50, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.setTransform(xfm);
    ctx.fillRect(-8, -30, 16, 40);

    ctx.translate(14, -26);
    ctx.rotate(Math.cos(anim * 5) * 0.4);
    ctx.fillRect(0, -6, 30, 12);
    ctx.setTransform(xfm);

    ctx.translate(-14, -26);
    ctx.rotate(-Math.cos(anim * 5) * 0.4 + Math.PI);
    ctx.fillRect(0, -6, 30, 12);
    ctx.setTransform(xfm);

    ctx.translate(8, 13);
    ctx.rotate(Math.cos(anim * 2) * 0.4 + 1);
    ctx.fillRect(0, -6, 30, 12);
    ctx.setTransform(xfm);

    ctx.translate(-8, 13);
    ctx.rotate(-Math.cos(anim * 2) * 0.4 - 1 + Math.PI);
    ctx.fillRect(0, -6, 30, 12);
    ctx.setTransform(xfm);

    ctx.setTransform(baseXfm);
  }

  function onBoom(obj) {
    const dx = obj.x - x;
    const dy = obj.y - y;
    if (dx * dx + dy * dy < 200 * 200) {
      bus.emit('blood', {x, y, n: 30});
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
    bus.emit('feed', { n: 20 });
    remove = true;
  }

  function shouldRemove() {
    if (remove) {
      bus.off('boom', onBoom);
    }
    return remove;
  }

  function getInAir() {
    return inAir;
  }

  return {
    update,
    render,
    shouldRemove,
    release,
    crush,
    getX,
    getY,
    getInAir,
  };
};

export default DrownMan;
