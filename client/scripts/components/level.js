import { canvas } from '../ui/canvas.js';
import Foliage from './foliage.js';

function Level() {
  let progress = canvas.height * 0.2;
  const foliages = [];

  for (let i = 200; i > -canvas.height; ) {
    foliages.push(new Foliage(-400 - Math.random() * 10, i, Math.random() * 0.4 - 0.2, 1));
    i -= 16 + Math.random() * 80;
  }
  for (let j = 200; j > -canvas.height; ) {
    foliages.push(new Foliage(400 + Math.random() * 10, j, 3.14+Math.random() * 0.4 - 0.2, 1));
    j -= 16 + Math.random() * 80;
  }

  function update(state, dT) {
    const newProgress = progress + (state.shark.getY() + canvas.height * 0.4 - progress) * 2.0 * dT;
    progress = Math.min(newProgress, progress);

    foliages.forEach((f) => f.update(state, dT));
  }

  function render(ctx) {
    ctx.fillStyle = '#111';
    ctx.fillRect(-400, -canvas.height + progress, -canvas.width, canvas.height * 2);
    ctx.fillRect(400, -canvas.height + progress, canvas.width, canvas.height * 2);

    foliages.forEach((f) => f.render(ctx));
  }

  function getProgress() {
    return progress;
  }

  return {
    update,
    render,
    getProgress,
  };
}

export default Level;