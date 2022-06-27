import bus from '../bus.js';
import ABILITY from '../constants/abilities.js';

const rankUps = {
  0: 6,
  1: 14,
  2: 26,
  3: 42,
};

function Stats() {
  let health = 3;
  let maxHealth = 3;
  let fish = 0;
  let fishForNextEvolution = rankUps[0];
  let abilities = []; //[ABILITY.HEAL, ABILITY.STASIS, ABILITY.BITE, ABILITY.DASH];

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

  function addAbility(ability) {
    abilities.push(ability);
    fishForNextEvolution = rankUps[abilities.length];
  }

  function getAbilities() {
    return abilities;
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
    getAbilities,
    addAbility,
  };
}

export default Stats;
