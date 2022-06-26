import bus from '../bus.js';
import { canvas } from '../ui/canvas.js';
import Foliage from './foliage.js';

function Level(engineState) {
  let shake = 0;
  let shakeAxis = 0;
  let progress = canvas.height * 0.2;
  let eventTicker = 0;
  const foliages = [];

  function update(state, dT) {
    const newProgress = progress + (state.shark.getY() + canvas.height * 0.3 - progress) * 2.0 * dT;
    const prevProgress = progress;
    progress = Math.min(newProgress, progress);
    eventTicker += prevProgress - progress;

    // Foliage updates
    foliages.forEach((f) => f.update(state, dT));

    // Camera / Level shake
    if (shake > 0) {
      shake -= dT;
    } else {
      shake = 0;
    }

    // Event spawner
    if (eventTicker > 500) {
      bus.emit('spawn:fish');
      eventTicker -= 800;
    }
  }

  function triggerShake(s) {
    shake = s;
    shakeAxis = (Math.random() - 0.5) * 0.05;
  }

  function getShakeAmount() {
    return 10 * shake * (Math.cos(shake * 60) * 0.8 + Math.random() * 0.5);
  }

  function getShakeX(a) {
    return Math.cos(shakeAxis) * a;
  }

  function getShakeY(a) {
    return Math.sin(shakeAxis) * a;
  }

  function getShakeRotation() {
    return shakeAxis * shake;
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
    getShakeAmount,
    getShakeX,
    getShakeY,
    getShakeRotation,
    triggerShake,
  };
}

export default Level;