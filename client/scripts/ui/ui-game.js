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

  ctx.setTransform(xfm);
}

export default {
  render,
};