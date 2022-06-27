const FILL = '#eee';

export default {
  // Stage 0
  'heal': {
    title: 'Heal',
    type: 0,
    fish: 10,
    hearts: 0,
    time: 0,
    description: ['Digest 10 fish from your', 'full belly to regain a', 'health point instantly.'],
    icon: (ctx) => {
      ctx.fillStyle = FILL;
      ctx.fillRect(-20, -6, 40, 12);
      ctx.fillRect(-6, -20, 12, 40);
    }
  },
  'stasis': {
    title: 'Stasis',
    type: 1,
    fish: 0,
    hearts: 0,
    time: 1,
    description: ['Rest briefly to recover a', 'health point. You will be', 'exposed while in stasis.'],
    icon: (ctx) => {
      ctx.strokeStyle = FILL;
      ctx.lineWidth = 6;
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
    description: [''],
    icon: (ctx) => {

    }
  },
  'dash': {
    title: 'Dash',
    type: 1,
    fish: 0,
    hearts: 1,
    time: 0,
    description: [''],
    icon: (ctx) => {
    }
  }
};
