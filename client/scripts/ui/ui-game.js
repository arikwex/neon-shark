import { ctx, canvas } from './canvas';

function render(gameEngine) {
  ctx.fillStyle = '#ace';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height - 200);

  gameEngine.state.shark.render(ctx);

  // Walls
  ctx.fillStyle = '#111';
  ctx.fillRect(-400, -canvas.height, -canvas.width, canvas.height * 2);
  ctx.fillRect(400, -canvas.height, canvas.width, canvas.height * 2);

  ctx.restore();
}

export default {
  render,
};