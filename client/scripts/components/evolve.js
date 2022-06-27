import bus from '../bus.js';
import ABILITY from '../constants/abilities.js';

const ranks = {
  0: [ABILITY.HEAL, ABILITY.STASIS],
  1: [ABILITY.FRENZY, ABILITY.IRON_JAW],
};

function Evolve() {
  let active = false;
  let fadeIn = 0;
  let options = [];

  function activate(rank) {
    active = true;
    fadeIn = 0;
    options = ranks[rank];
  }

  function done() {
    active = false;
  }

  function isActive() {
    return active;
  }

  function getFade() {
    return fadeIn;
  }

  function getOptions() {
    return options;
  }

  function update(state, dT) {
    if (active) {
      if (fadeIn < 1) {
        fadeIn += dT * 1.5;
      } else {
        fadeIn = 1;
      }
    } else {
      if (fadeIn > 0) {
        fadeIn -= dT * 1.5;
      } else {
        fadeIn = 0;
      }
    }
  }

  function selectLeft() {
    if (active && fadeIn >= 1) {
      bus.emit('ability:gain', options[0]);
      done();
    }
  }

  function selectRight() {
    if (active && fadeIn >= 1) {
      bus.emit('ability:gain', options[1]);
      done();
    }
  }

  return {
    update,
    activate,
    isActive,
    getFade,
    getOptions,
    selectLeft,
    selectRight,
  }
}

export default Evolve;
