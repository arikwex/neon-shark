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
  let ripple = 0;
  let bvx = 0;
  let bvy = 0;
  let omega = 0;
  let hitRecently = 0;
  let hasMan = true;

  function update(state, dT) {
    const dax = state.shark.getX() - x;
    const day = state.shark.getY() - y;
    const d2 = dax * dax + day * day;
    const vx = state.shark.getVX();
    const vy = state.shark.getVY();
    let targetAim = 0;

    // Aim at shark
    if (hasMan) {
      if (d2 > 4000) {
        const d1 = Math.sqrt(d2);
        if (aimPrep < 2.4) {
          let forcast = 0.0014 * aimPrep;
          targetAim = Math.atan2(day + vy * d1 * forcast, dax + vx * d1 * forcast);
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
    }

    const dAim = turn(targetAim, aim, 7);
    aim += dAim * 3.0 * dT;

    // Bash physics
    if (d2 < 3000 && state.shark.isBashing() && hitRecently <= 0) {
      hitRecently = 1;
      omega = (Math.random() - 0.5) * 3;
      bvx += vx * 0.6;
      bvy += vy * 0.6;
      hasMan = false;
      bus.emit('shark:bash', { x, y, vx, vy });
    }
    if (hitRecently > 0) {
      hitRecently -= dT;
    }

    // Boat physics
    x += bvx * dT;
    y += bvy * dT;
    angle += omega * dT;
    bvx -= bvx * 3.0 * dT;
    bvy -= bvy * 3.0 * dT;
    omega -= omega * 2.0 * dT;

    // Boundary physics
    const leftLimit = state.level.levelMapLeft(y);
    const rightLimit = state.level.levelMapRight(y);
    if (x < leftLimit + 70) {
      x = leftLimit + 70;
      bvx = -bvx;
    }
    if (x > rightLimit - 70) {
      x = rightLimit - 70;
      bvx = -bvx;
    }

    // Ripple animator
    ripple += dT;
    if (ripple > 0.3) {
      const rippleDir = Math.random() * 6.28;
      const px = x + Math.cos(angle + rippleDir) * 30;
      const py = y + Math.sin(angle + rippleDir) * 70;
      bus.emit('ripple', {
        x: px, y: py,
        size: 20 + Math.random() * 20,
        direction: rippleDir,
        duration: 2,
      });
      ripple = 0;
    }

    if (y - 400 > state.level.getProgress() && aimPrep < 0) {
      remove = true;
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

    if (hasMan) {
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
    }

    ctx.setTransform(baseXfm);
  }

  function shouldRemove() {
    return remove;
  }

  function getX() {
    return x;
  }

  function getY() {
    return y;
  }

  function unman() {
    const hadPerson = hasMan;
    hasMan = false;
    return hadPerson;
  }

  function destroy() {
    remove = true;
  }

  return {
    update,
    render,
    shouldRemove,
    unman,
    destroy,
    getX,
    getY,
  };
};

export default Boatman;
