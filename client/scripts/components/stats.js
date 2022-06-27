import bus from '../bus.js';
import ABILITY from '../constants/abilities.js';

const rankUps = {
  0: 10,
  1: 20,
  2: 40,
  3: 80,
};

function Stats() {
  let health = 3;
  let maxHealth = 3;
  let fish = 0;
  let fishForNextEvolution = rankUps[0];
  let abilities = [];//[ABILITY.HEAL, ABILITY.FRENZY, ABILITY.BASH];

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

  function addHealth(hp) {
    health += hp;
    if (health > maxHealth) {
      health = maxHealth;
    }
  }

  function addAbility(ability) {
    abilities.push(ability);
    fishForNextEvolution = rankUps[abilities.length];
    fish = 0;
    maxHealth += 1;
    health += 1;
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
    addHealth,
    getHealth,
    getMaxHealth,
    getFish,
    getFishForNextEvolution,
    getAbilities,
    addAbility,
  };
}

export default Stats;
