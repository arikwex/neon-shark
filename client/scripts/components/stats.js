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

  function removeHealth(hp) {
    health -= hp;
    if (health <= 0) {
      health = 0;
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
    removeHealth,
    getHealth,
    getMaxHealth,
    getFish,
    getFishForNextEvolution,
  };
}

export default Stats;
