import bus from '../bus.js';
import ui from '../ui/ui-game.js';
import GameEngine from '../components/game-engine.js';
import { transition, SCENES } from '../scenes/scene-manager.js';

let requestAnimate = null;
let gameEngine = null;

function initialize() {
  gameEngine = GameEngine();
  animate();
}

function cleanup() {
  window.cancelAnimationFrame(requestAnimate);
  gameEngine = null;
}

function animate() {
  ui.render(gameEngine);
  requestAnimate = window.requestAnimationFrame(animate);
}

export default {
  initialize,
  cleanup,
};
