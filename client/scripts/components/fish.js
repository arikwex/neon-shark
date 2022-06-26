import { canvas } from '../ui/canvas.js';
import bus from '../bus.js';

const SKIN_COLOR = '#d93';

function Fish(x, y, angle) {
  let anim = 0;
  let eaten = false;

  function update(state, dT) {
    // Motion
    const speed = 60;
    x += Math.sin(angle) * dT * speed;
    y -= Math.cos(angle) * dT * speed;
    angle += 1.0 * dT;
    anim += 6.0 * dT;

    // Chomp physics
    const dx = state.shark.getMouthX() - x;
    const dy = state.shark.getMouthY() - y;
    if (dx * dx + dy * dy < 400) {
      eaten = true;
      bus.emit('bite', { x, y });
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

  function shouldRemove() {
    return eaten;
  }

  return {
    update,
    render,
    shouldRemove,
  };
};

export default Fish;
