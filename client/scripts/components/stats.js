import bus from '../bus.js';

function Stats() {
  let health = 3;
  let maxHealth = 3;
  let fish = 0;
  let fishForNextEvolution = 4;

  function feed(n) {
    fish += n;
    if (fish >= fishForNextEvolution) {
      fish = fishForNextEvolution;
      bus.emit('evolve');
    }
  }

  function getHealth() {
    return health;
  }

  function getMaxHealth() {
    return maxHealth;
  }

  function getFish() {
    return fish;
  }

  function getFishForNextEvolution() {
    return fishForNextEvolution;
  }

  return {
    feed,
    getHealth,
    getMaxHealth,
    getFish,
    getFishForNextEvolution,
  };
}

export default Stats;
