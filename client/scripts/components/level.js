import { canvas } from '../ui/canvas.js';

function Level() {
  let progress = canvas.height * 0.2;

  function update(state, dT) {
    const newProgress = progress + (state.shark.getY() + canvas.height * 0.4 - progress) * 2.0 * dT;
    progress = Math.min(newProgress, progress);
  }

  function getProgress() {
    return progress;
  }

  return {
    update,
    getProgress,
  };
}

export default Level;