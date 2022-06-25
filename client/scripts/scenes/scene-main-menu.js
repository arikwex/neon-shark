import bus from '../bus.js';
import ui from '../ui/ui-main-menu.js';
import { transition, SCENES } from '../scenes/scene-manager.js';

let requestAnimate = null;

function initialize() {
  bus.on('any-key', onAnyKey);
  animate();
}

function cleanup() {
  bus.off('any-key', onAnyKey);
  window.cancelAnimationFrame(requestAnimate);
}

function animate() {
  ui.render();
  requestAnimate = window.requestAnimationFrame(animate);
}

function onAnyKey() {
  transition(SCENES.GAME);
}

export default {
  initialize,
  cleanup,
};
