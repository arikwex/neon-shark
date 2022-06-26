import bus from '../bus.js';
import ui from '../ui/ui-game.js';
import GameEngine from '../components/game-engine.js';
import { transition, SCENES } from '../scenes/scene-manager.js';

let requestAnimate = null;
let gameEngine = null;
let lastFrameTime = Date.now();

function initialize() {
  lastFrameTime = Date.now();
  gameEngine = GameEngine();
  gameEngine.initialize();
  animate();
}

function cleanup() {
  window.cancelAnimationFrame(requestAnimate);
  gameEngine?.cleanup();
  gameEngine = null;
}

function animate() {
  currentFrameTime = Date.now();
  const dT = Math.min((currentFrameTime - lastFrameTime) / 1000, 0.3);

  gameEngine.update(dT);
  ui.render(gameEngine);
  requestAnimate = window.requestAnimationFrame(animate);
  lastFrameTime = currentFrameTime;
}

export default {
  initialize,
  cleanup,
};
