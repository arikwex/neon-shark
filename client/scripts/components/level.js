import { canvas } from '../ui/canvas.js';
import Foliage from './foliage.js';

function Level(engineState) {
  let progress = canvas.height * 0.2;
  const foliages = [];

  function update(state, dT) {
    const newProgress = progress + (state.shark.getY() + canvas.height * 0.4 - progress) * 2.0 * dT;
    progress = Math.min(newProgress, progress);

    foliages.forEach((f) => f.update(state, dT));
  }

  function levelWidth(y) {
    return 600 + Math.cos(y * 0.001) * 100 + Math.cos(y * 0.002) * 50;
  }

  function levelCenter(y) {
    return Math.cos(y * 0.001) * 100 + Math.sin(y * 0.0005) * 60;
  }

  function levelMapLeft(y) {
    const w = levelWidth(y);
    const cx = levelCenter(y);
    return -w/2 + Math.cos(y * 0.01) * 10 + Math.sin(y * 0.02) * 5 + cx;
  }

  function levelMapRight(y) {
    const w = levelWidth(y);
    const cx = levelCenter(y);
    return w/2 + Math.cos(y * 0.007) * 11 + Math.sin(y * 0.022) * 4 + cx;
  }

  function levelMap(x, y) {
    if (x < 0) {
      return levelMapLeft(y);
    } else {
      return levelMapRight(y);
    }
  }

  function render(ctx) {
    ctx.fillStyle = '#111';

    // Left wall
    ctx.beginPath();
    let first = true;
    for (let y = parseInt((-canvas.height * 1.4 + progress) / 100) * 100; y < canvas.height * 0.3 + progress; y += 100) {
      if (first) {
        ctx.moveTo(levelMapLeft(y), y);
        first = false;
      } else {
        ctx.lineTo(levelMapLeft(y), y);
      }
    }
    ctx.lineTo(-canvas.width, canvas.height * 0.4 + progress);
    ctx.lineTo(-canvas.width, -canvas.height * 1.4 + progress);
    ctx.fill();

    // Right wall
    ctx.beginPath();
    first = true;
    for (let y = parseInt((-canvas.height * 1.4 + progress) / 100) * 100; y < canvas.height * 0.3 + progress; y += 100) {
      if (first) {
        ctx.moveTo(levelMapRight(y), y);
        first = false;
      } else {
        ctx.lineTo(levelMapRight(y), y);
      }
    }
    ctx.lineTo(canvas.width, canvas.height * 0.4 + progress);
    ctx.lineTo(canvas.width, -canvas.height * 1.4 + progress);
    ctx.fill();

    foliages.forEach((f) => f.render(ctx));
  }

  function getProgress() {
    return progress;
  }

  for (let i = 200; i > -canvas.height; ) {
    foliages.push(new Foliage(-400 - Math.random() * 10, i, Math.random() * 0.4 - 0.2, levelMap, getProgress));
    i -= 16 + Math.random() * 50;
  }
  for (let j = 200; j > -canvas.height; ) {
    foliages.push(new Foliage(400 + Math.random() * 10, j, 3.14+Math.random() * 0.4 - 0.2, levelMap, getProgress));
    j -= 16 + Math.random() * 50;
  }

  return {
    update,
    render,
    getProgress,
    levelMapLeft,
    levelMapRight,
  };
}

export default Level;