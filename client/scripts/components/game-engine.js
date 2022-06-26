import bus from '../bus.js';
import Level from './level.js';
import Shark from './shark.js';

const GameEngine = () => {
  const state = {
    level: new Level(),
    shark: new Shark(),
  };

  function update(dT) {
    state.shark.update(state, dT);
    state.level.update(state, dT);
  }

  return {
    state,
    update,
  };
};

export default GameEngine;