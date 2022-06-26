import { ctx, canvas } from './canvas';

function render(gameEngine) {
  ctx.fillStyle = '#ace';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const state = gameEngine.state;
  const xfm = ctx.getTransform();

  // Camera baseline
  ctx.rotate(state.level.getShakeRotation());
  ctx.translate(canvas.width / 2, canvas.height - state.level.getProgress());

  // Camera shake
  const a = state.level.getShakeAmount();
  ctx.translate(state.level.getShakeX(a), state.level.getShakeY(a));

  // Game elements
  state.fishes.forEach((f) => f.render(ctx));
  state.shark.render(ctx);
  state.particles.forEach((p) => p.render(ctx));
  state.level.render(ctx);
  state.boats.forEach((b) => b.render(ctx));
  state.harpoons.forEach((h) => h.render(ctx));

  ctx.setTransform(xfm);

  // HUD
  // HEART COUNT
  ctx.fillStyle = '#e44';
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 5;
  const MAX_HEALTH = state.stats.getMaxHealth();
  const HEALTH = state.stats.getHealth();

  for (let i = 0; i < MAX_HEALTH; i++) {
    ctx.setTransform(xfm);
    ctx.translate(i * 54 + 50, 40);
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(0, 0);
    ctx.lineTo(10, -10);
    ctx.lineTo(20, 0);
    ctx.lineTo(0, 20);
    ctx.closePath();
    if (i < HEALTH) {
      ctx.fill();
    }
    ctx.stroke();
  }

  // FISH COUNT
  ctx.fillStyle = '#d93';
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 5;
  const MAX_FISH = state.stats.getFishForNextEvolution();
  const FISH = state.stats.getFish();

  ctx.setTransform(xfm);
  ctx.translate(50, 100);
  ctx.beginPath();
  ctx.moveTo(-20, -15);
  ctx.lineTo(0, 0);
  ctx.lineTo(20, -15);
  ctx.lineTo(40, 0);
  ctx.lineTo(20, 15);
  ctx.lineTo(0, 0);
  ctx.lineTo(-20, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.font = '40px Jaldi';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${FISH} / ${MAX_FISH}`, 60, 3);

  ctx.setTransform(xfm);

  // Blood mask
  const bloodMask = state.level.getBloodMask();
  if (bloodMask > 0) {
    const alpha = bloodMask * bloodMask;
    ctx.fillStyle = `rgba(255,0,0,${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

export default {
  render,
};