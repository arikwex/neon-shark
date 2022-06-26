import { canvas } from '../ui/canvas.js';

function CircleParticle(x, y, vx, vy, size, color, duration) {
  let anim = 0;
  let baseSize = size;

  function update(state, dT) {
    x += vx * dT;
    y += vy * dT;
    vx -= vx * 2.0 * dT;
    vy -= vy * 2.0 * dT;
    size += baseSize / duration * dT;
    anim += dT;
  }

  function render(ctx) {
    const alpha = Math.max(1 - anim / duration, 0) * (color.a || 1);
    ctx.lineWidth = 6;
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fill();
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

export default CircleParticle;
