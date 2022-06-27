export default {
  // Stage 0
  'heal': {
    title: 'Heal',
    type: 0,
    fish: 10,
    hearts: 0,
    icon: (ctx) => {
      ctx.fillStyle = '#444';
      ctx.fillRect(-20, -6, 40, 12);
      ctx.fillRect(-6, -20, 12, 40);
    }
  },
  // Stage 1
  'bite': {
    title: 'Bite',
    type: 0,
    fish: 4,
    hearts: 0,
    icon: (ctx) => {

    }
  },
  'dash': {
    title: 'Dash',
    type: 1,
    fish: 0,
    hearts: 1,
    icon: (ctx) => {
    }
  }
};
