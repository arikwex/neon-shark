import { ctx, canvas } from './canvas';

function render() {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // logo
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f47';
  ctx.font = '6em Jaldi';
  ctx.fillText('Neon Shark', canvas.width / 2, canvas.height * 0.3);

  // Press any key to start
  ctx.fillStyle = '#47f';
  ctx.font = `${4 + Math.sin(Date.now() * 0.01) * 0.2}em Jaldi`;
  ctx.fillText('[Press Any Key]', canvas.width / 2, canvas.height * 0.7);
};

export default {
  render,
};