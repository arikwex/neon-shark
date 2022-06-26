import { ctx, canvas } from './canvas';

function render(gameEngine) {
  ctx.fillStyle = '#ace';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const state = gameEngine.state;
  const xfm = ctx.getTransform();
  ctx.translate(canvas.width / 2, canvas.height - state.level.getProgress());

  state.fishes.forEach((f) => f.render(ctx));
  state.shark.render(ctx);
  state.level.render(ctx);

  ctx.setTransform(xfm);
}

export default {
  render,
};