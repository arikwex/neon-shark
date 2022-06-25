import bus from '../bus.js';

function ControllerManager() {

  function initialize() {
    window.onkeydown = (evt) => {
      if (evt.key == 'ArrowUp') { bus.emit('control:up'); }
      if (evt.key == 'ArrowDown') { bus.emit('control:down'); }
      if (evt.key == 'ArrowLeft') { bus.emit('control:left'); }
      if (evt.key == 'ArrowRight') { bus.emit('control:right'); }
      bus.emit('any-key');
    };
  };

  return {
    initialize,
  };
}

export default ControllerManager();