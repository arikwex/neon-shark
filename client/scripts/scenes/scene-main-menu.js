import bus from '../bus.js';
import ui from '../ui/ui-main-menu.js';
import GameEngine from '../components/game-engine.js';
import { transition, SCENES } from '../scenes/scene-manager.js';

let requestAnimate = null;
let gameEngine = null;

function initialize() {
  setTimeout(() => { bus.on('any-key', onAnyKey); }, 500);
  gameEngine = GameEngine();
  gameEngine.state.shark.setCanMove(false);
  animate();
}

function cleanup() {
  bus.off('any-key', onAnyKey);
  window.cancelAnimationFrame(requestAnimate);
  gameEngine?.cleanup();
  gameEngine = null;
}

function animate() {
  ui.render(gameEngine);
  gameEngine.state.shark.update(gameEngine.state, 0.02);
  requestAnimate = window.requestAnimationFrame(animate);
}

function onAnyKey() {
  transition(SCENES.GAME);
}

export default {
  initialize,
  cleanup,
};
