import bus from '../bus.js';

function ControllerManager() {
  const keymap = {};

  function initialize() {
    window.onkeydown = (evt) => {
      keymap[evt.key] = true;
      bus.emit('any-key');
    };

    window.onkeyup = (evt) => {
      keymap[evt.key] = false;
      bus.emit('any-key');
    };
  };

  function getUp() { return keymap['ArrowUp']; }
  function getDown() { return keymap['ArrowDown']; }
  function getLeft() { return keymap['ArrowLeft']; }
  function getRight() { return keymap['ArrowRight']; }

  return {
    initialize,
    getUp,
    getDown,
    getLeft,
    getRight,
  };
}

export default ControllerManager();