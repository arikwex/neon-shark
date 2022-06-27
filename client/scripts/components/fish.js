import { canvas } from '../ui/canvas.js';
import bus from '../bus.js';

const SKIN_COLOR = '#d93';

function Fish(x, y, angle) {
  let anim = 0;
  let wave = Math.random() * 100;
  let wavePulse = Math.random() * 2 + 3;
  let remove = false;
  let scared = 0;

  bus.on('blood', onScare);
  bus.on('ability:stasis-end', onScare);

  function update(state, dT) {
    // Motion
    let speed = 60;
    if (scared > 0) {
      speed = 200;
    }
    const vx = Math.sin(angle);
    x += vx * dT * speed;
    y -= Math.cos(angle) * dT * speed;
    angle += Math.cos(wave) * dT;
    anim += speed / 30.0 * dT;
    wave += wavePulse * dT;

    // Chomp physics
    const dx = state.shark.getMouthX() - x;
    const dy = state.shark.getMouthY() - y;
    if (state.shark.hasOpenMouth() && dx * dx + dy * dy < 600) {
      remove = true;
      bus.emit('feed', { n: 1 });
      bus.emit('bite', { x, y });
      bus.emit('blood', { x, y, n: 3 });
    }

    // Boundary physics
    const leftLimit = state.level.levelMapLeft(y);
    const rightLimit = state.level.levelMapRight(y);
    const bottomLimit = state.level.getProgress();
    if (x < leftLimit + 90 && vx < 0) {
      angle -= 1.0 * dT;
    }
    if (x < leftLimit + 20) {
      x = leftLimit + 20;
      angle -= 1.0 * dT;
    }
    if (x > rightLimit - 90 && vx > 0) {
      angle += 1.0 * dT;
    }
    if (x > rightLimit - 20) {
      x = rightLimit - 20;
      angle += 1.0 * dT;
    }
    if (y > bottomLimit + 50) {
      remove = true;
    }

    // Harpoon collision check
    for (let i = 0; i < state.harpoons.length; i++) {
      const harpoon = state.harpoons[i];
      const dx = harpoon.getX() - x;
      const dy = harpoon.getY() - y;
      if (dx * dx + dy * dy < 700) {
        bus.emit('blood', { x, y, n: 3 });
        remove = true;
        break;
      }
    }

    // Scared behavior
    if (scared > 0) {
      scared -= dT;
      angle += 10.0 * (Math.random() - 0.5) * dT;
    }
  }

  function render(ctx) {
    const baseXfm = ctx.getTransform();
    ctx.translate(x, y);
    ctx.rotate(angle + Math.cos(anim * 4) * 0.1);

    const xfm = ctx.getTransform();
    ctx.fillStyle = SKIN_COLOR;
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(-10, 5);
    ctx.lineTo(0, -10);
    ctx.lineTo(10, 5);
    ctx.fill();

    ctx.setTransform(xfm);
    ctx.translate(0, 20);
    ctx.rotate(Math.cos(anim * 4 - 2) * 0.2);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-10, 10);
    ctx.lineTo(10, 10);
    ctx.fill();

    ctx.setTransform(baseXfm);
  }

  function getX() {
    return x;
  }

  function getY() {
    return y;
  }

  function onScare() {
    scared = 1 + Math.random() * 1.5;
  }

  function shouldRemove() {
    if (remove) {
      bus.off('blood', onScare);
      bus.off('ability:stasis-end', onScare);
    }
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

export default Fish;
