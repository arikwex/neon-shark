import { ctx, canvas } from './canvas';
import ABILITY from '../constants/abilities.js';
import ABILITY_DATA from '../constants/ability-data.js';

const abilityKeys = ['Q', 'W', 'E', 'R'];

function render(gameEngine) {
  ctx.fillStyle = '#ace';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const state = gameEngine.state;
  const isEvolve = state.evolve.isActive();
  const xfm = ctx.getTransform();

  // Camera baseline
  if (!isEvolve) {
    ctx.rotate(state.level.getShakeRotation());
  }
  ctx.translate(canvas.width / 2, canvas.height - state.level.getProgress());

  // Camera shake
  if (!isEvolve) {
    const a = state.level.getShakeAmount();
    ctx.translate(state.level.getShakeX(a), state.level.getShakeY(a));
  }

  // Game elements
  state.fishes.forEach((f) => f.render(ctx));
  state.shark.render(ctx);
  state.particles.forEach((p) => p.render(ctx));
  state.level.render(ctx);
  state.boats.forEach((b) => b.render(ctx));
  state.harpoons.forEach((h) => h.render(ctx));

  ctx.setTransform(xfm);

  // ABILITY HUD
  if (!isEvolve) {
    const abilities = state.stats.getAbilities();
    const NUM_ABILITIES = abilities.length;
    ctx.translate(0, canvas.height - 90);
    for (let i = 0; i < NUM_ABILITIES; i++) {
      drawAbility(i, NUM_ABILITIES, abilities[i], true);
    }
    ctx.setTransform(xfm);
  }

  // EVOLVE HUD
  if (isEvolve) {
    evolveMenu(state, xfm);
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

  if (!isEvolve) {
    // Blood mask
    const bloodMask = state.level.getBloodMask();
    if (bloodMask > 0) {
      const alpha = bloodMask * bloodMask;
      ctx.fillStyle = `rgba(255,0,0,${alpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
}

function evolveMenu(state, xfm) {
  ctx.globalAlpha = state.evolve.getFade();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Title of menu
  ctx.fillStyle = '#eee';
  ctx.textAlign = 'center';
  ctx.font = '90px Jaldi';
  ctx.fillText(`Level 1`, canvas.width / 2 , 100);

  // Instinct vs. Cybernetics
  ctx.font = '42px Jaldi';
  ctx.fillStyle = '#e66';
  ctx.fillText('INSTINCTS', canvas.width / 2 - 200, canvas.height / 2 - 100);
  ctx.fillStyle = '#66e';
  ctx.fillText('CYBERNETICS', canvas.width / 2 + 200, canvas.height / 2 - 100);

  // Cards + Explanations
  const options = state.evolve.getOptions();
  ctx.setTransform(xfm);
  ctx.translate(-200, canvas.height / 2);
  drawExplanation(ABILITY_DATA[options[0]].description);
  ctx.font = '28px Jaldi';
  ctx.fillStyle = '#e66';
  ctx.fillText('[Left Arrow Key]', canvas.width / 2, 240);
  drawAbility(0, 1, options[0], false);

  ctx.setTransform(xfm);
  ctx.translate(200, canvas.height / 2);
  drawExplanation(ABILITY_DATA[options[1]].description);
  ctx.font = '28px Jaldi';
  ctx.fillStyle = '#66e';
  ctx.fillText('[Right Arrow Key]', canvas.width / 2, 240);
  drawAbility(0, 1, options[1], false);

  ctx.globalAlpha = 1;
}

function drawAbility(i, n, ability, showKey = false) {
  const xfm = ctx.getTransform();
  const data = ABILITY_DATA[ability];
  const fish = data.fish;
  const hearts = data.hearts;
  const time = data.time;

  // CARD
  ctx.translate(canvas.width / 2 + (- (n - 1) / 2 + i) * 120, 0);
  ctx.lineWidth = 5;
  if (data.type == 0) {
    ctx.fillStyle = 'rgba(150,120,120,0.6)';
    ctx.strokeStyle = 'rgba(255,40,40,0.6)';
  } else {
    ctx.fillStyle = 'rgba(120,120,150,0.6)';
    ctx.strokeStyle = 'rgba(40,40,255,0.6)';
  }
  ctx.fillRect(-50, -50, 100, 100);
  ctx.strokeRect(-50, -50, 100, 100);

  // ICON AND TEXT
  ctx.fillStyle = '#eee';
  ctx.textAlign = 'center';
  ctx.font = '24px Jaldi';
  ctx.fillText(data.title, 0, 35);
  ctx.translate(0, -3);
  ctx.scale(0.8, 0.8);
  data.icon(ctx);

  if (showKey) {
    ctx.fillStyle = '#111';
    ctx.textAlign = 'center';
    ctx.font = '28px Jaldi';
    ctx.fillText(`[ ${abilityKeys[i]} ]`, 0, 90);
  }

  // HEART COST
  if (hearts == 1) {
    ctx.fillStyle = '#eee';
    ctx.translate(0, -41);
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
    ctx.fillStyle = '#eee';
    ctx.translate(-22, -41);
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
  if (time == 1) {
    ctx.strokeStyle = '#eee';
    ctx.translate(0, -41);
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, 0);
    ctx.lineTo(4, -1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.setTransform(xfm);
}

function drawExplanation(rows) {
  ctx.fillStyle = '#ccc';
  ctx.font = '24px Jaldi';
  ctx.textAlign = 'center';
  for (let i = 0; i < rows.length; i++) {
    ctx.fillText(rows[i], canvas.width / 2, 110 + i * 30);
  }
}

export default {
  render,
};