import { canvas } from '../ui/canvas.js';

function Foliage(x, y, baseAngle, mass) {
  let angle = 0;
  let omega = 0;
  let acc = 0;
  let px = Math.sin(baseAngle);
  let py = Math.cos(baseAngle);
  let l1 = Math.random() * 40 + 10;
  let l2 = Math.random() * 40 + 10;
  let l3 = Math.random() * 40 + 10;
  let mode = Math.random() > 0.5;

  function reconfigure() {
    angle = 0;
    omega = 0;
    acc = 0;
    l1 = Math.random() * 40 + 10;
    l2 = Math.random() * 40 + 10;
    l3 = Math.random() * 40 + 10;
    mode = Math.random() > 0.5;
  }

  function update(state, dT) {
    const dx = state.shark.getX() - x;
    const dy = state.shark.getY() - y;
    const d2 = dx * dx + dy * dy;
    omega += (state.shark.getVX() * px + state.shark.getVY() * py) * dT / (15 + d2 * 0.008);

    a = Date.now() * 0.001;
    const turbulence = Math.cos(x * 0.01 + y * 0.02 + a) + Math.sin(y * 0.01 + a);
    omega += (-angle * 20.0 - omega * 3.0 + turbulence * 1.0) / mass * dT;
    angle += omega * dT;

    if (y - 50 > state.level.getProgress()) {
      y -= canvas.height + 100 + 50 * Math.random();
      reconfigure();
    }
  }

  function render(ctx, state) {
    const xfm = ctx.getTransform();
    ctx.translate(x, y);
    ctx.rotate(baseAngle + angle);

    ctx.lineWidth = 10.0;
    ctx.strokeStyle = '#111';
    if (mode) {
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(l1, 0);
      ctx.moveTo(-5, -9);
      ctx.lineTo(l2, -15 + angle * 9);
      ctx.moveTo(-5, 9);
      ctx.lineTo(l3, 15 + angle * 9);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(l1, 7 + angle * 9);
      ctx.moveTo(-5, -9);
      ctx.lineTo(l2, -7 + angle * 9);
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
