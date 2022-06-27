import { ctx, canvas } from './canvas';
import ABILITY from '../constants/abilities.js';
import ABILITY_DATA from '../constants/ability-data.js';

function render(gameEngine) {
  ctx.fillStyle = '#ace';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const state = gameEngine.state;
  const xfm = ctx.getTransform();

  // Camera baseline
  ctx.rotate(state.level.getShakeRotation());
  ctx.translate(canvas.width / 2, canvas.height - state.level.getProgress());

  // Camera shake
  const a = state.level.getShakeAmount();
  ctx.translate(state.level.getShakeX(a), state.level.getShakeY(a));

  // Game elements
  state.fishes.forEach((f) => f.render(ctx));
  state.shark.render(ctx);
  state.particles.forEach((p) => p.render(ctx));
  state.level.render(ctx);
  state.boats.forEach((b) => b.render(ctx));
  state.harpoons.forEach((h) => h.render(ctx));

  ctx.setTransform(xfm);

  // ABILITY HUD
  const abilities = state.stats.getAbilities();
  const NUM_ABILITIES = abilities.length;
  for (let i = 0; i < NUM_ABILITIES; i++) {
    drawAbility(i, NUM_ABILITIES, abilities[i]);
  }

  // HUD
  // HEART COUNT
  ctx.textAlign = 'left';
  ctx.fillStyle = '#e44';
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 5;
  const MAX_HEALTH = state.stats.getMaxHealth();
  const HEALTH = state.stats.getHealth();

  for (let i = 0; i < MAX_HEALTH; i++) {
    ctx.setTransform(xfm);
    ctx.translate(i * 54 + 50, 40);
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(0, 0);
    ctx.lineTo(10, -10);
    ctx.lineTo(20, 0);
    ctx.lineTo(0, 20);
    ctx.closePath();
    if (i < HEALTH) {
      ctx.fill();
    }
    ctx.stroke();
  }

  // FISH COUNT
  ctx.fillStyle = '#d93';
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 5;
  const MAX_FISH = state.stats.getFishForNextEvolution();
  const FISH = state.stats.getFish();

  ctx.setTransform(xfm);
  ctx.translate(50, 100);
  ctx.beginPath();
  ctx.moveTo(-20, -15);
  ctx.lineTo(0, 0);
  ctx.lineTo(20, -15);
  ctx.lineTo(40, 0);
  ctx.lineTo(20, 15);
  ctx.lineTo(0, 0);
  ctx.lineTo(-20, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.font = '40px Jaldi';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${FISH} / ${MAX_FISH}`, 60, 3);

  ctx.setTransform(xfm);

  // Blood mask
  const bloodMask = state.level.getBloodMask();
  if (bloodMask > 0) {
    const alpha = bloodMask * bloodMask;
    ctx.fillStyle = `rgba(255,0,0,${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawAbility(i, n, ability) {
  const xfm = ctx.getTransform();
  const data = ABILITY_DATA[ability];
  const fish = data.fish;
  const hearts = data.hearts;

  // CARD
  ctx.translate(canvas.width / 2 + (- (n - 1) / 2 + i) * 120, canvas.height - 70);
  ctx.lineWidth = 5;
  if (data.type == 0) {
    ctx.fillStyle = 'rgba(250,250,210,0.6)';
    ctx.strokeStyle = 'rgba(170,170,140,0.6)';
  } else {
    ctx.fillStyle = 'rgba(190,190,250,0.6)';
    ctx.strokeStyle = 'rgba(130,130,170,0.6)';
  }
  ctx.fillRect(-50, -50, 100, 100);
  ctx.strokeRect(-50, -50, 100, 100);

  // ICON AND TEXT
  if (data.type == 0) {
    ctx.fillStyle = 'rgba(170,170,140,1)';
  } else {
    ctx.fillStyle = 'rgba(150,150,190,1)';
  }
  ctx.fillStyle = '#444';
  ctx.textAlign = 'center';
  ctx.font = '24px Jaldi';
  ctx.fillText(data.title, 0, 35);
  ctx.scale(0.8, 0.8);
  data.icon(ctx);

  // HEART COST
  if (hearts == 1) {
    ctx.fillStyle = '#f44';
    ctx.translate(0, -44);
    ctx.scale(0.8, 0.8);
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(0, 0);
    ctx.lineTo(10, -10);
    ctx.lineTo(20, 0);
    ctx.lineTo(0, 20);
    ctx.closePath();
    ctx.fill();
  }
  if (fish > 0) {
    ctx.fillStyle = '#d93';
    ctx.translate(-22, -44);
    ctx.textAlign = 'left';
    ctx.font = '24px Jaldi';
    ctx.fillText(`x ${fish}`, 26, 1);
    ctx.scale(0.6, 0.6);
    ctx.beginPath();
    ctx.moveTo(-20, -15);
    ctx.lineTo(0, 0);
    ctx.lineTo(20, -15);
    ctx.lineTo(40, 0);
    ctx.lineTo(20, 15);
    ctx.lineTo(0, 0);
    ctx.lineTo(-20, 15);
    ctx.closePath();
    ctx.fill();
  }

  ctx.setTransform(xfm);
}

export default {
  render,
};