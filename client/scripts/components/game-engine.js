import bus from '../bus.js';
import Shark from './shark.js';

const GameEngine = () => {
  const state = {
    shark: new Shark(),
  };

  function update(dT) {
    state.shark.update(dT);
  }

  return {
    state,
    update,
  };
};

export default GameEngine;