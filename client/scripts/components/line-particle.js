import { canvas } from '../ui/canvas.js';

function LineParticle(x, y, vx, vy, color, duration) {
  let anim = 0;

  function update(state, dT) {
    x += vx * dT;
    y += vy * dT;
    vx -= vx * 3.0 * dT;
    vy -= vy * 3.0 * dT;
    anim += dT;
  }

  function render(ctx) {
    const alpha = Math.max(1 - anim / duration, 0);
    ctx.lineWidth = 6;
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + vx * 0.1, y + vy * 0.1);
    ctx.stroke();
  }

  function shouldRemove() {
    return anim >= duration;
  }

  return {
    update,
    render,
    shouldRemove,
  };
};

export default LineParticle;
