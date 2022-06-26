import bus from '../bus.js';
import { canvas } from '../ui/canvas.js';
import Level from './level.js';
import Stats from './stats.js';
import Shark from './shark.js';
import Fish from './fish.js';
import Harpoon from './harpoon.js';
import Boatman from './boatman.js';
import LineParticle from './line-particle.js';
import CircleParticle from './circle-particle.js';

const GameEngine = () => {
  const state = {
    stats: new Stats(),
    level: new Level(),
    shark: new Shark(),
    fishes: [],
    boats: [],
    harpoons: [],
    particles: [],
  };

  state.boats.push(new Boatman(0, -400, 0.2));

  function initialize() {
    bus.on('feed', ({n}) => {
      state.stats.feed(n);
    });

    bus.on('bite', ({x, y}) => {
      const baseHeading = state.shark.getHeading();
      for (let i = -2; i <= 2; i++) {
        const px = x;
        const py = y;
        const vx = Math.sin(baseHeading + i) * (100 + Math.random() * 200);
        const vy = -Math.cos(baseHeading + i) * (100 + Math.random() * 200);
        const duration = Math.random() * 0.4 + 0.1;
        state.particles.push(new LineParticle(px, py, vx, vy, {r: 250, g: 240, b: 230}, duration));
      }
      state.level.triggerShake(0.4);
    });

    bus.on('blood', ({x, y, n}) => {
      for (let i = 0; i < n; i++) {
        const px = x;
        const py = y;
        const vx = (Math.random() - 0.5) * 120;
        const vy = (Math.random() - 0.5) * 120;
        const duration = Math.random() * 1.0 + 0.6;
        state.particles.push(new CircleParticle(px, py, vx, vy, 10, {r: 250, g: 40, b: 40, a: 0.2}, duration));
      }
    });

    bus.on('spawn:fish', () => {
      const n = 1 + Math.random() * 3;
      const dir = Math.PI + (Math.random() - 0.5) * 2;
      const x = (Math.random() - 0.5) * 300;
      const y = state.level.getProgress() - canvas.height - 100;
      for (let i = 0; i < n; i++) {
        const dy = -Math.random() * 250;
        const dx = (Math.random() - 0.5) * 150;
        state.fishes.push(new Fish(x + dx, y + dy, dir + (Math.random() - 0.5) * 0.1));
      }
    });

    bus.on('harpoon', ({x, y, aim}) => {
      state.harpoons.push(new Harpoon(x, y, aim));
    });
  }

  function cleanup() {
    bus.off('bite');
    bus.off('blood');
    bus.off('spawn:fish');
  }

  function update(dT) {
    state.shark.update(state, dT);
    state.level.update(state, dT);
    state.fishes.forEach((f) => f.update(state, dT));
    state.boats.forEach((b) => b.update(state, dT));
    state.harpoons.forEach((h) => h.update(state, dT));
    state.particles.forEach((p) => p.update(state, dT));

    filterRemove(state.fishes);
    filterRemove(state.boats);
    filterRemove(state.harpoons);
    filterRemove(state.particles);
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
    initialize,
    cleanup,
  };
};

export default GameEngine;