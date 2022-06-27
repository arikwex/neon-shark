import { canvas } from '../ui/canvas.js';

function RippleParticle(x, y, aim, size, duration) {
  let anim = 0;
  let baseSize = size;

  function update(state, dT) {
    x += Math.cos(aim) * dT * 20;
    y += Math.sin(aim) * dT * 20;
    size += baseSize / duration * dT;
    anim += dT;
  }

  function render(ctx) {
    const alpha = Math.min(anim * 3, 1) * Math.max(1 - anim / duration, 0) * 0.7;
    ctx.lineWidth = 5;
    ctx.strokeStyle = `rgba(230, 240, 250, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, aim - 0.5, aim + 0.5);
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

export default RippleParticle;
