import { canvas } from '../ui/canvas.js';
import bus from '../bus.js';

function Boatman(x, y, angle) {
  let aim = 0;
  let remove = false;
  let patrolDirection = 15;
  if (Math.random() > 0.5) {
    patrolDirection *= -1;
  }
  let patrolTime = 0;
  let aimPrep = 0;
  let lockedAim = 0;
  let quickness = 0.4;

  function update(state, dT) {
    const dax = state.shark.getX() - x;
    const day = state.shark.getY() - y;
    const d2 = dax * dax + day * day;
    const vx = state.shark.getVX();
    const vy = state.shark.getVY();
    let targetAim = 0;

    if (d2 > 4000 && Math.abs(day) < 750) {
      const d1 = Math.sqrt(d2);
      if (aimPrep < 2.4) {
        targetAim = Math.atan2(day + vy * d1 * 0.001, dax + vx * d1 * 0.001);
        lockedAim = targetAim;
      } else {
        targetAim = lockedAim;
      }
      aimPrep += dT;
      if (aimPrep > 2.6 + quickness) {
        aimPrep = -1;
        bus.emit('harpoon', { x: x + Math.cos(lockedAim) * 40, y: y + Math.sin(lockedAim) * 40, aim: lockedAim });
      }
    } else {
      targetAim = aim + patrolDirection * dT;
      patrolTime += dT;
      if (patrolTime > 1.0) {
        patrolTime = -Math.random() * 2;
        patrolDirection *= - 1;
      }
      aimPrep = 0;
    }

    const dAim = turn(targetAim, aim, 7);
    aim += dAim * 3.0 * dT;

    // Chomp physics
    const dx = state.shark.getMouthX() - x;
    const dy = state.shark.getMouthY() - y;
    if (dx * dx + dy * dy < 600) {
      // remove = true;
      // bus.emit('feed', { n: 1 });
      // bus.emit('bite', { x, y });
      // bus.emit('blood', { x, y, n: 3 });
    }
  }

  function turn(a1, a2, maxRate) {
    let angle = a1 - a2;
    while (angle < -Math.PI) { angle += 2 * Math.PI; }
    while (angle > Math.PI) { angle -= 2 * Math.PI; }
    return Math.min(Math.max(angle, -maxRate), maxRate);
  }

  function render(ctx) {
    const baseXfm = ctx.getTransform();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Boat
    const xfm = ctx.getTransform();
    ctx.fillStyle = '#a83';
    ctx.strokeStyle ='#ca5';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, -90);
    ctx.lineTo(-25, -80);
    ctx.lineTo(-44, -50);
    ctx.lineTo(-40, 90);
    ctx.lineTo(40, 90);
    ctx.lineTo(44, -50);
    ctx.lineTo(25, -80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#497';
    ctx.strokeStyle ='#6b8';
    ctx.fillRect(-20, 80, 40, 30);
    ctx.strokeRect(-20, 80, 40, 30);

    // Man
    ctx.rotate(-angle);
    ctx.fillStyle ='#111';
    ctx.strokeStyle ='#111';
    ctx.lineWidth = 8;
    ctx.rotate(aim);
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(20, -20);
    ctx.lineTo(40, -7);
    ctx.moveTo(0, 0);
    ctx.lineTo(10, 26);
    ctx.lineTo(25, 4);
    ctx.stroke();

    // Harpoon
    ctx.strokeStyle ='#f00';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(55, 0);
    ctx.lineTo(80, 0);
    ctx.lineTo(70, -5);
    ctx.moveTo(80, 0);
    ctx.lineTo(70, 5);
    ctx.stroke();
    ctx.fillStyle ='#555';
    ctx.fillRect(20, -7, 40, 14);

    // Aim prep
    if (aimPrep > 1.0 && aimPrep < 2.4 + quickness) {
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(255,100, 100,${aimPrep * 0.3})`;
      ctx.lineWidth = 30 * Math.exp(-(aimPrep - 1) * 2.5);
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.lineTo(80 + 1000, 0);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255,0,0,${aimPrep - 1})`;
      ctx.lineWidth = 2;
      ctx.lineDashOffset = -aimPrep * 60;
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.lineTo(80 + 1000, 0);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (aimPrep > 2.4 + quickness) {
      ctx.setLineDash([]);
      ctx.strokeStyle = `rgba(255,30,30,${0.4 - (aimPrep - 2.4 - quickness) * 2})`;
      ctx.lineWidth = 40 * (1 - Math.exp(-(aimPrep - 2.4 - quickness) * 9.5));
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.lineTo(80 + 1000, 0);
      ctx.stroke();
    }

    ctx.setTransform(baseXfm);
  }

  function shouldRemove() {
    return remove;
  }

  return {
    update,
    render,
    shouldRemove,
  };
};

export default Boatman;
