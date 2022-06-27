import { canvas } from '../ui/canvas.js';
import bus from '../bus.js';
import CircleParticle from './circle-particle.js';

const PROJECTILE_SPEED = 1000;

function Rocket(x, y, angle) {
  let remove = false;
  let anim = 0;

  function update(state, dT) {
    x += Math.cos(angle) * PROJECTILE_SPEED * anim * dT;
    y += Math.sin(angle) * PROJECTILE_SPEED * anim * dT;

    const leftLimit = state.level.levelMapLeft(y);
    const rightLimit = state.level.levelMapRight(y);
    if (x < leftLimit) {
      boom();
      return;
    }
    if (x > rightLimit) {
      boom();
      return;
    }

    state.particles.push(new CircleParticle(
      x, y, (Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 6, {r: 40, g: 40, b: 40, a: 0.4}, 0.3)
    );

    for (let i = 0; i < state.boats.length; i++) {
      const boat = state.boats[i];
      const dx = boat.getX() - x;
      const dy = boat.getY() - y;
      if (dx * dx + dy * dy < 4000) {
        boat.destroy();
        boom();
        return;
      }
    }

    anim += dT;
    if (anim > 4) {
      remove = true;
    }
  }

  function boom() {
    remove = true;
    bus.emit('boom', {x, y});
  }

  function render(ctx) {
    const baseXfm = ctx.getTransform();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Rocket
    ctx.strokeStyle = `#22f`;
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

export default Rocket;
