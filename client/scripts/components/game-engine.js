import bus from '../bus.js';
import { transition, SCENES } from '../scenes/scene-manager.js';
import { canvas } from '../ui/canvas.js';
import Level from './level.js';
import Evolve from './evolve.js';
import Stats from './stats.js';
import Shark from './shark.js';
import Fish from './fish.js';
import Harpoon from './harpoon.js';
import Rocket from './rocket.js';
import Boatman from './boatman.js';
import DrownMan from './drown-man.js';
import Plank from './plank.js';
import LineParticle from './line-particle.js';
import CircleParticle from './circle-particle.js';
import RippleParticle from './ripple-particle.js';

const GameEngine = () => {
  const state = {
    evolve: new Evolve(),
    stats: new Stats(),
    level: new Level(),
    shark: new Shark(),
    fishes: [],
    boats: [],
    rockets: [],
    planks: [],
    drowners: [],
    harpoons: [],
    particles: [],
  };

  let fadeIn = 0;
  let gameOverTimer = 0;
  let freedom = false;

  function initialize() {
    bus.on('evolve', () => {
      if (freedom) {
        return;
      }
      const level = state.stats.getAbilities().length;
      if (level == 3) {
        freedom = true;
      } else {
        state.evolve.activate(level);
      }
    });

    bus.on('ability:gain', (ability) => {
      state.stats.addAbility(ability);
    });

    bus.on('control:left', () => { state.evolve.selectLeft(); });
    bus.on('control:right', () => { state.evolve.selectRight(); });
    bus.on('control:q', () => { state.shark.useAbility(state, 0); });
    bus.on('control:w', () => { state.shark.useAbility(state, 1); });
    bus.on('control:e', () => { state.shark.useAbility(state, 2); });
    bus.on('control:r', () => { state.shark.useAbility(state, 3); });

    bus.on('feed', ({n}) => {
      state.stats.feed(n);
    });

    bus.on('shark:hit', () => {
      if (freedom) {
        return;
      }
      state.stats.removeHealth(1);
      state.shark.hit();
      state.level.hit();
    });

    bus.on('shark:mouth-full', () => {
      const baseHeading = state.shark.getHeading();
      const x = state.shark.getJawX();
      const y = state.shark.getJawY();
      for (let i = -2; i <= 2; i++) {
        const vx = Math.sin(baseHeading + i) * (200 + Math.random() * 200);
        const vy = -Math.cos(baseHeading + i) * (200 + Math.random() * 200);
        const duration = Math.random() * 0.4 + 0.1;
        state.particles.push(new LineParticle(x, y, vx, vy, {r: 80, g: 50, b: 30}, duration));
      }
      state.level.triggerShake(0.2);
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

    bus.on('ripple', ({x, y, direction, size, duration}) => {
      state.particles.push(new RippleParticle(x, y, direction, size, duration));
    });

    bus.on('shark:bash', ({ x, y, vx, vy }) => {
      bus.emit('shark:mouth-full');
      const mx = state.shark.getMouthX();
      const my = state.shark.getMouthY();
      for (let i = 0; i < 10; i++) {
        const vx = (Math.random() - 0.5) * 430;
        const vy = (Math.random() - 0.5) * 230;
        const duration = 0.5 + Math.random() * 0.5;
        state.particles.push(new CircleParticle(mx, my, vx, vy, 10 + Math.random() * 10, {r: 100, g: 100, b: 100, a: 0.4}, duration));
      }
      state.level.triggerShake(0.4);
      state.shark.hitBoat();
      state.drowners.push(new DrownMan(x, y, Math.random() * 7, vx * 0.5, vy * 0.5));
    });

    bus.on('spawn:fish', () => {
      const n = 1 + Math.random() * 6;
      const dir = Math.PI + (Math.random() - 0.5) * 2;
      const x = (Math.random() - 0.5) * 300;
      const y = state.level.getProgress() - canvas.height - 100;
      for (let i = 0; i < n; i++) {
        const dy = -Math.random() * 250;
        const dx = (Math.random() - 0.5) * 150;
        state.fishes.push(new Fish(x + dx, y + dy, dir + (Math.random() - 0.5) * 0.1));
      }
    });

    bus.on('spawn:boatman', () => {
      const x = (Math.random() - 0.5) * 300;
      const y = state.level.getProgress() - canvas.height - 100;
      state.boats.push(new Boatman(x, y, (Math.random() - 0.5) * 4));
    });

    bus.on('spawn:plank', () => {
      let n = Math.random() * 5;
      for (let i = 0; i < n; i++) {
        const x = (Math.random() - 0.5) * 400;
        const y = state.level.getProgress() - canvas.height - 100 - Math.random() * 300;
        state.planks.push(new Plank(x, y, (Math.random() - 0.5) * 7));
      }
    });

    bus.on('harpoon', ({x, y, aim}) => {
      state.harpoons.push(new Harpoon(x, y, aim));
    });

    bus.on('ability:heal', () => {
      const baseHeading = state.shark.getHeading();
      const x = state.shark.getMouthX();
      const y = state.shark.getMouthY();
      for (let i = -5; i <= 5; i++) {
        const px = x;
        const py = y;
        const vx = Math.sin(baseHeading + i) * (200 + Math.random() * 300);
        const vy = -Math.cos(baseHeading + i) * (200 + Math.random() * 300);
        const duration = Math.random() * 0.4 + 0.1;
        state.particles.push(new LineParticle(px, py, vx, vy, {r: 250, g: 240, b: 230}, duration));
      }
      for (let i = -5; i <= 5; i++) {
        const px = x + (Math.random() - 0.5) * 20;
        const py = y + (Math.random() - 0.5) * 30;
        state.particles.push(new RippleParticle(px, py, i * 1.2 + Math.random() - 0.5, 20, 1.4));
      }
      state.level.triggerShake(0.4);
      state.stats.feed(-10);
      state.stats.addHealth(1);
    });

    bus.on('ability:stasis', () => {
      state.shark.beginStasis();
    });

    bus.on('ability:stasis-end', () => {
      const baseHeading = state.shark.getHeading();
      const x = state.shark.getMouthX();
      const y = state.shark.getMouthY();
      for (let i = -5; i <= 5; i++) {
        const px = x;
        const py = y;
        const vx = Math.sin(baseHeading + i) * (200 + Math.random() * 300);
        const vy = -Math.cos(baseHeading + i) * (200 + Math.random() * 300);
        const duration = Math.random() * 0.4 + 0.1;
        state.particles.push(new LineParticle(px, py, vx, vy, {r: 250, g: 240, b: 230}, duration));
      }
      state.level.triggerShake(0.4);
      state.stats.addHealth(1);
    });

    bus.on('ability:frenzy', () => {
      const baseHeading = state.shark.getHeading();
      const x = state.shark.getMouthX();
      const y = state.shark.getMouthY();
      for (let i = -5; i <= 5; i++) {
        const px = x;
        const py = y;
        const vx = Math.sin(baseHeading + i) * (30 + Math.random() * 140);
        const vy = -Math.cos(baseHeading + i) * (30 + Math.random() * 140);
        const duration = Math.random() * 0.4 + 0.4;
        state.particles.push(new CircleParticle(px, py, vx, vy, 10, {r: 250, g: 100, b: 40, a: 0.4}, duration));
      }
      state.level.triggerShake(0.4);
      state.stats.removeHealth(1);
      state.shark.beginFrenzy();
    });

    bus.on('ability:iron-jaw', () => {
      bus.emit('shark:mouth-full');
      const x = state.shark.getMouthX();
      const y = state.shark.getMouthY();
      state.level.triggerShake(0.4);
      state.stats.feed(-4);
      state.shark.beginIronJaw();
      for (let i = 0; i < 10; i++) {
        const vx = (Math.random() - 0.5) * 430;
        const vy = (Math.random() - 0.5) * 230;
        const duration = 0.5 + Math.random() * 0.5;
        state.particles.push(new CircleParticle(x, y, vx, vy, 10 + Math.random() * 10, {r: 80, g: 50, b: 30, a: 0.4}, duration));
      }
    });

    bus.on('ability:bash', () => {
      const baseHeading = state.shark.getHeading();
      const x = state.shark.getMouthX();
      const y = state.shark.getMouthY();
      for (let i = -5; i <= 5; i++) {
        const px = x;
        const py = y;
        const vx = Math.sin(baseHeading + i) * (30 + Math.random() * 140);
        const vy = -Math.cos(baseHeading + i) * (30 + Math.random() * 140);
        const duration = Math.random() * 0.4 + 0.4;
        state.particles.push(new CircleParticle(px, py, vx, vy, 10, {r: 40, g: 200, b: 40, a: 0.4}, duration));
      }
      state.level.triggerShake(0.4);
      state.stats.feed(-10);
      state.shark.beginBash();
    });

    bus.on('ability:rocket', () => {
      const baseHeading = state.shark.getHeading();
      const x = state.shark.getMouthX();
      const y = state.shark.getMouthY();
      for (let i = -5; i <= 5; i++) {
        const px = x;
        const py = y;
        const vx = Math.sin(baseHeading + i) * (30 + Math.random() * 140);
        const vy = -Math.cos(baseHeading + i) * (30 + Math.random() * 140);
        const duration = Math.random() * 0.4 + 0.4;
        state.particles.push(new CircleParticle(px, py, vx, vy, 10, {r: 50, g: 50, b: 50, a: 0.4}, duration));
      }
      state.level.triggerShake(0.4);
      state.stats.removeHealth(1);
      state.rockets.push(new Rocket(x, y, baseHeading - Math.PI / 2));
    });

    bus.on('boom', ({ x, y }) => {
      for (let i = 0; i < 15; i++) {
        const px = x + (Math.random() - 0.5) * 300;
        const py = y + (Math.random() - 0.5) * 300;
        const vx = (Math.random() - 0.5) * 240;
        const vy = (Math.random() - 0.5) * 240;
        const duration = Math.random() * 0.5 + 0.7;
        state.particles.push(new CircleParticle(px, py, vx, vy, 30 + Math.random() * 30, {r: 250, g: 80, b: 40, a: 0.8}, duration));
      }
      state.level.triggerShake(0.6);
      state.boats.forEach((b) => {
        let dx = b.getX() - x;
        let dy = b.getY() - y;
        const m = Math.sqrt(dx * dx + dy * dy);
        dx = dx / m * 100;
        dy = dy / m * 100;
        if (b.unman()) {
          state.drowners.push(new DrownMan(b.getX(), b.getY(), Math.random() * 7, dx, dy));
        }
      });
    });
  }

  function cleanup() {
    bus.off('control:left');
    bus.off('control:right');
    bus.off('evolve');
    bus.off('ability:gain');

    bus.off('bite');
    bus.off('feed');
    bus.off('blood');
    bus.off('shark:hit');
    bus.off('spawn:fish');
    bus.off('spawn:boatman');
    bus.off('harpoon');
  }

  function update(dT) {
    if (state.stats.getHealth() == 0 || freedom) {
      gameOverTimer += dT;
      if (gameOverTimer > 4) {
        transition(SCENES.MAIN_MENU);
        return;
      }
    }
    if (fadeIn < 1) {
      fadeIn += dT;
    }

    state.evolve.update(state, dT);
    if (state.evolve.isActive()) {
      // !!
    } else {
      state.shark.update(state, dT);
      state.level.update(state, dT);
      state.fishes.forEach((f) => f.update(state, dT));
      state.boats.forEach((b) => b.update(state, dT));
      state.rockets.forEach((r) => r.update(state, dT));
      state.planks.forEach((p) => p.update(state, dT));
      state.drowners.forEach((d) => d.update(state, dT));
      state.harpoons.forEach((h) => h.update(state, dT));
      state.particles.forEach((p) => p.update(state, dT));

      filterRemove(state.fishes);
      filterRemove(state.boats);
      filterRemove(state.harpoons);
      filterRemove(state.planks);
      filterRemove(state.drowners);
      filterRemove(state.rockets);
      filterRemove(state.particles);
    }
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

  function getGameOverTimer() {
    return gameOverTimer;
  }

  function isVictory() {
    return freedom;
  }

  function getFadeIn() {
    return fadeIn;
  }

  return {
    state,
    update,
    initialize,
    cleanup,
    getGameOverTimer,
    isVictory,
    getFadeIn,
  };
};

export default GameEngine;