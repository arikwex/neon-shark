import { ctx, canvas } from './canvas';

function render(gameEngine) {
  const xfm = ctx.getTransform();
  ctx.fillStyle = '#ace';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // logo
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#111';
  ctx.font = '6em Jaldi';
  ctx.fillText('Neon Shark', canvas.width / 2, canvas.height * 0.3);

  // Press any key to start
  ctx.fillStyle = '#111';
  ctx.font = `${4 + Math.sin(Date.now() * 0.01) * 0.2}em Jaldi`;
  ctx.fillText('[Press Any Key]', canvas.width / 2, canvas.height * 0.7);

  ctx.setTransform(xfm);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  gameEngine.state.shark.render(ctx);
  ctx.translate(-60, 300);
  gameEngine.state.level.render(ctx);

  ctx.setTransform(xfm);
};

export default {
  render,
};