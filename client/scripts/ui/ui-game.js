import { ctx, canvas } from './canvas';

function render(gameEngine) {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

export default {
  render,
};