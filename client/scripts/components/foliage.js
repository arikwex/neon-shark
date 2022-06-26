import { canvas } from '../ui/canvas.js';

function Foliage(x, y, baseAngle, levelMap, getProgress) {
  let angle = 0;
  let omega = 0;
  let acc = 0;
  let px = Math.sin(baseAngle);
  let py = Math.cos(baseAngle);
  let l1 = 10;
  let l2 = 10;
  let l3 = 10;
  let mode = false;
  let curl1 = false;
  let curl2 = false;

  function reconfigure() {
    angle = 0;
    omega = 0;
    acc = 0;
    l1 = Math.random() * 50 + 15;
    l2 = Math.random() * 50 + 15;
    l3 = Math.random() * 50 + 15;
    mode = Math.random() > 0.5;
    curl1 = Math.random() > 0.5;
    curl2 = Math.random() > 0.5;
    if (mode) {
      mass = (l1 + l2 + l3) / 3 / 15;
    } else {
      mass = (l1 + l2) / 2 / 15;
    }
    x = levelMap(x, y);
    const x2 = levelMap(x, y-5);
    const x3 = levelMap(x, y+5);
    if (x < 0) {
      x -= 5 + Math.random() * 10;
      baseAngle = Math.atan2(x2 - x3, 10);
    } else {
      x += 5 + Math.random() * 10;
      baseAngle = Math.atan2(x3 - x2, -10);
    }
    px = Math.sin(baseAngle);
    py = Math.cos(baseAngle);
  }
  reconfigure();

  function update(state, dT) {
    const dx = state.shark.getX() - x;
    const dy = state.shark.getY() - y;
    const d2 = dx * dx + dy * dy;
    const touchForce = 45 * (state.shark.getVX() * px + state.shark.getVY() * py) * dT / (5 + d2 * 0.005);

    a = Date.now() * 0.001;
    const turbulence = Math.cos(x * 0.01 + y * 0.02 + a) + Math.sin(y * 0.01 + a);
    omega += (-angle * 20.0 - omega * 3.0 + turbulence * 2.0 + touchForce) / mass * dT;
    angle += omega * dT;

    if (y - 100 > getProgress()) {
      y -= canvas.height + 200;
      reconfigure();
    }
  }

  function render(ctx, state) {
    const xfm = ctx.getTransform();
    ctx.translate(x, y);
    ctx.rotate(baseAngle + angle);

    ctx.lineWidth = 8.0;
    ctx.strokeStyle = '#111';
    if (mode) {
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(l1, 0);
      ctx.moveTo(-5, -9);
      ctx.lineTo(l2, -15 + angle * 9);
      if (curl2) {
        ctx.lineTo(l2 * 1.1, -18 + angle * 9);
        ctx.lineTo(l2 * 1.2, -24 + angle * 5);
        ctx.lineTo(l2 * 1.1, -29 + angle * 1);
      }
      ctx.moveTo(-5, 9);
      ctx.lineTo(l3, 15 + angle * 9);
      if (curl2) {
        ctx.lineTo(l3 * 1.1, 18 + angle * 9);
        ctx.lineTo(l3 * 1.2, 24 + angle * 5);
        ctx.lineTo(l3 * 1.1, 29 + angle * 2);
      }
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(l1, 7 + angle * 9);
      if (curl1) {
        ctx.lineTo(l1 * 1.1, 11 + angle * 9);
        ctx.lineTo(l1 * 1.2, 17 + angle * 5);
        ctx.lineTo(l1 * 1.1, 22 + angle * 2);
      }
      ctx.moveTo(-5, -9);
      ctx.lineTo(l2, -7 + angle * 9);
      if (curl2) {
        ctx.lineTo(l2 * 1.1, -10 + angle * 9);
        ctx.lineTo(l2 * 1.2, -15 + angle * 5);
        ctx.lineTo(l2 * 1.1, -20 + angle * 1);
      }
      ctx.stroke();
    }

    ctx.setTransform(xfm);
  }

  return {
    update,
    render,
  };
};

export default Foliage;
