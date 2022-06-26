import bus from '../bus.js';
import Level from './level.js';
import Shark from './shark.js';
import Fish from './fish.js';

const GameEngine = () => {
  const state = {
    level: new Level(),
    shark: new Shark(),
    fishes: [],
  };

  state.fishes.push(new Fish(0, -300, 0));

  function update(dT) {
    state.shark.update(state, dT);
    state.level.update(state, dT);
    state.fishes.forEach((f) => f.update(state, dT));
  }

  return {
    state,
    update,
  };
};

export default GameEngine;