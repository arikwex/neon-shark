const FILL = '#eee';

export default {
  // Stage 1
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
  // Stage 2
  'frenzy': {
    title: 'Frenzy',
    type: 0,
    fish: 0,
    hearts: 1,
    time: 0,
    description: ['Enter a feeding frenzy that', 'increased speed and agility', 'for a short period.'],
    icon: (ctx) => {
      ctx.fillStyle = FILL;
      ctx.beginPath();
      ctx.moveTo(-20, -20);
      ctx.lineTo(-16, -5);
      ctx.lineTo(-12, -20);
      ctx.closePath();
      ctx.moveTo(-10, -20);
      ctx.lineTo(-6, -10);
      ctx.lineTo(-2, -20);
      ctx.closePath();
      ctx.moveTo(10, -20);
      ctx.lineTo(6, -10);
      ctx.lineTo(2, -20);
      ctx.closePath();
      ctx.moveTo(20, -20);
      ctx.lineTo(16, -5);
      ctx.lineTo(12, -20);
      ctx.closePath();

      ctx.moveTo(-20, 20);
      ctx.lineTo(-16, 5);
      ctx.lineTo(-12, 20);
      ctx.closePath();
      ctx.moveTo(-10, 20);
      ctx.lineTo(-6, 10);
      ctx.lineTo(-2, 20);
      ctx.closePath();
      ctx.moveTo(10, 20);
      ctx.lineTo(6, 10);
      ctx.lineTo(2, 20);
      ctx.closePath();
      ctx.moveTo(20, 20);
      ctx.lineTo(16, 5);
      ctx.lineTo(12, 20);
      ctx.closePath();
      ctx.fill();
    }
  },
  'iron-jaw': {
    title: 'Iron Jaw',
    type: 1,
    fish: 4,
    hearts: 0,
    time: 0,
    description: ['Use your mechanical jaws to', 'crush large objects that previously', 'could not be eaten.'],
    icon: (ctx) => {
      ctx.strokeStyle = FILL;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(-20, 0, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-20, 0, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeRect(-5, 3, 30, 9);
      ctx.strokeRect(26, 13, 8, -20);
    }
  },
  // Stage 2
  'bash': {
    title: 'Bash',
    type: 0,
    fish: 10,
    hearts: 0,
    time: 0,
    description: ['Charge forward a short distance.', 'Bashing into a boat will', 'push the person off.'],
    icon: (ctx) => {
      ctx.strokeStyle = FILL;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-20, -20);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-20, 20);
      ctx.moveTo(0, -20);
      ctx.lineTo(10, 0);
      ctx.lineTo(0, 20);
      ctx.moveTo(20, -20);
      ctx.lineTo(30, 0);
      ctx.lineTo(20, 20);
      ctx.stroke();
    }
  },
  'rocket': {
    title: 'Rocket',
    type: 1,
    fish: 0,
    hearts: 1,
    time: 0,
    description: ['Fire a rocket that will destroy', 'anything in its explosion radius.'],
    icon: (ctx) => {
      ctx.fillStyle = FILL;
      ctx.lineWidth = 3;

      ctx.fillRect(-10, -7, 50, 14);
      ctx.fillRect(-15, -7, 20, -7);
      ctx.fillRect(-15, 7, 20, 7);
      ctx.beginPath();
      ctx.arc(-20, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-30, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-37, 0, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};
