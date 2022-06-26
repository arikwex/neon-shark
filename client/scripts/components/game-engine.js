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
  state.fishes.push(new Fish(-100, -400, 0));
  state.fishes.push(new Fish(100, -300, 0));

  function update(dT) {
    state.shark.update(state, dT);
    state.level.update(state, dT);
    state.fishes.forEach((f) => f.update(state, dT));

    filterRemove(state.fishes);
  }

  function filterRemove(arr) {
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj.shouldRemove()) {
        arr.splice(i, 1);
        i--;
      }
    }
  }

  return {
    state,
    update,
  };
};

export default GameEngine;