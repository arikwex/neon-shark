export default {
  // Stage 0
  'heal': {
    title: 'Heal',
    type: 0,
    fish: 10,
    hearts: 0,
    time: 0,
    icon: (ctx) => {
      ctx.fillStyle = '#444';
      ctx.fillRect(-20, -6, 40, 12);
      ctx.fillRect(-6, -20, 12, 40);
    }
  },
  'stasis': {
    title: 'Stasis',
    type: 0,
    fish: 0,
    hearts: 0,
    time: 1,
    icon: (ctx) => {
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 6;
      // ctx.beginPath();
      // ctx.arc(0, 0, 20, 0, Math.PI * 2);
      // ctx.stroke();
      // ctx.beginPath();
      // ctx.arc(0, 0, 10, 0, Math.PI * 2);
      // ctx.stroke();
      ctx.strokeRect(-20, -20, 40, 40);
      ctx.strokeRect(-10, -10, 20, 20);
    }
  },
  // Stage 1
  'bite': {
    title: 'Bite',
    type: 0,
    fish: 4,
    hearts: 0,
    time: 0,
    icon: (ctx) => {

    }
  },
  'dash': {
    title: 'Dash',
    type: 1,
    fish: 0,
    hearts: 1,
    time: 0,
    icon: (ctx) => {
    }
  }
};
