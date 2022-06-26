import { canvas } from '../ui/canvas.js';
import bus from '../bus.js';

const PROJECTILE_SPEED = 1200;

function Harpoon(x, y, angle) {
  let remove = false;
  let anim = 0;
  let stuck = false;
  let fade = 1;

  function update(state, dT) {
    if (!stuck) {
      x += Math.cos(angle) * PROJECTILE_SPEED * dT;
      y += Math.sin(angle) * PROJECTILE_SPEED * dT;
    } else {
      fade -= dT;
    }

    // Shark collision check
    const mx = state.shark.getMouthX();
    const my = state.shark.getMouthY();
    const sx = state.shark.getX();
    const sy = state.shark.getY();
    const cx = mx - sx;
    const cy = my - sy;
    for (let i = -2; i <= 1; i++ ) {
      const dx = sx + cx * i - x;
      const dy = sy + cy * i - y;
      if (dx * dx + dy * dy < 700) {
        bus.emit('blood', { x, y, n: 3 });
        remove = true;
        break;
      }
    }

    const leftLimit = state.level.levelMapLeft(y);
    const rightLimit = state.level.levelMapRight(y);
    if (x < leftLimit) {
      stuck = true;
    }
    if (x > rightLimit) {
      stuck = true;
    }

    anim += dT;
    if (anim > 4 || fade <= 0) {
      remove = true;
    }
  }

  function render(ctx) {
    const baseXfm = ctx.getTransform();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Harpoon
    ctx.strokeStyle = `rgba(255,0,0,${fade})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.lineTo(10, 0);
    ctx.lineTo(0, -5);
    ctx.moveTo(10, 0);
    ctx.lineTo(0, 5);
    ctx.stroke();

    ctx.setTransform(baseXfm);
  }

  function getX() {
    return x;
  }

  function getY() {
    return y;
  }

  function shouldRemove() {
    return remove;
  }

  return {
    update,
    render,
    shouldRemove,
    getX,
    getY,
  };
};

export default Harpoon;
