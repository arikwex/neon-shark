import bus from '../bus.js';

function ControllerManager() {
  const keymap = {};

  function initialize() {
    window.onkeydown = (evt) => {
      keymap[evt.key] = true;
      if (evt.key == 'ArrowLeft') { bus.emit('control:left'); }
      if (evt.key == 'ArrowRight') { bus.emit('control:right'); }
      if (evt.key == 'q') { bus.emit('control:q'); }
      if (evt.key == 'w') { bus.emit('control:w'); }
      if (evt.key == 'e') { bus.emit('control:e'); }
      if (evt.key == 'r') { bus.emit('control:r'); }
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