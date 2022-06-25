import { transition, SCENES } from './scenes/scene-manager.js';
import AudioManager from './managers/audio-manager.js';
import ControllerManager from './managers/controller-manager.js';

(() => {
  AudioManager.initialize();
  ControllerManager.initialize();
  transition(SCENES.GAME);
})();