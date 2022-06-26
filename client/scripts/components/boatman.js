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

  function update(state, dT) {
    const dax = state.shark.getX() - x;
    const day = state.shark.getY() - y;
    const d2 = dax * dax + day * day;
    let targetAim = 0;

    if (d2 > 2400) {
      targetAim = Math.atan2(day, dax);
    } else {
      targetAim = aim + patrolDirection * dT;
      patrolTime += dT;
      if (patrolTime > 1.0) {
        patrolTime = -Math.random() * 2;
        patrolDirection *= - 1;
      }
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
