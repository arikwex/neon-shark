import controllerManager from '../managers/controller-manager.js';

const SKIN_COLOR = '#57a';
const SW = 17;
const PHASE = 1.1;

function Shark() {
  let x = 0;
  let y = 0;
  let vx = 0;
  let vy = 0;
  let omega = 0;
  let heading = 0;
  let moveArc = 0;
  let anim = 0;

  function update(state, dT) {
    // Controls
    let tx = 0;
    let ty = 0;
    const MAX_FORCE = 800;
    const MAX_TURN = 1.5 * MAX_FORCE / 800;
    if (controllerManager.getUp()) { ty = -MAX_FORCE; }
    if (controllerManager.getDown()) { ty = MAX_FORCE; }
    if (controllerManager.getLeft()) { tx = -MAX_FORCE; }
    if (controllerManager.getRight()) { tx = MAX_FORCE; }

    // Motion limits
    const speed = Math.sqrt(vx * vx + vy * vy);
    let mag = Math.sqrt(tx * tx + ty * ty);
    if (mag > MAX_FORCE) {
      tx = tx / mag * MAX_FORCE;
      ty = ty / mag * MAX_FORCE;
    }

    // Thrust physics
    vx += tx * dT;
    vy += ty * dT;

    // Turn physics
    let targetHeading = Math.atan2(tx, -ty);
    if (mag < 10) {
      targetHeading = heading;
    }
    const dH = turn(targetHeading, heading, 3.14);
    omega += (dH - omega) * 22.0 * MAX_TURN * dT;
    omega = Math.max(Math.min(omega, 0.7 * MAX_TURN), -0.7 * MAX_TURN);
    heading += omega * 5.0 * MAX_TURN * dT;
    moveArc += (-omega - moveArc) * 5.0 * MAX_TURN * dT;

    // Viscosity physics
    vx -= vx * 2.0 * dT;
    vy -= vy * 2.0 * dT;

    // Boundary physics
    const leftLimit = state.level.levelMapLeft(y);
    const rightLimit = state.level.levelMapRight(y);
    const bottomLimit = state.level.getProgress();
    if (x < leftLimit + 25) {
      x = leftLimit + 25;
      vx *= -0.5;
    }
    if (x > rightLimit - 25) {
      x = rightLimit - 25;
      vx *= -0.5;
    }
    if (y > bottomLimit - 25) {
      y = bottomLimit - 25;
    }

    // Motion physics
    x += vx * dT * 0.25 + Math.sin(heading) * speed * dT * 0.75;
    y += vy * dT * 0.25 - Math.cos(heading) * speed * dT * 0.75;

    // Animation tracker
    const speed2 = Math.sqrt(vx * vx + vy * vy);
    const dS = Math.max(speed2 - speed, 0);
    anim += (speed * 0.4 + dS * 40.0) * dT / 75.0 + 0.2 * dT + Math.abs(omega) * dT;
  }

  function turn(a1, a2, maxRate) {
    let angle = a1 - a2;
    while (angle < -Math.PI) { angle += 2 * Math.PI; }
    while (angle > Math.PI) { angle -= 2 * Math.PI; }
    return Math.min(Math.max(angle, -maxRate), maxRate);
  }

  function getY() {
    return y;
  }

  function getX() {
    return x;
  }

  function getVY() {
    return vy;
  }

  function getVX() {
    return vx;
  }

  function render(ctx) {
    const baseXfm = ctx.getTransform();

    ctx.translate(x, y);
    ctx.rotate(heading);
    ctx.scale(0.75, 0.75);
    ctx.fillStyle = SKIN_COLOR;

    const arc = moveArc * 0.9;
    const xfm = ctx.getTransform();

    // Upper Torso
    ctx.setTransform(xfm);
    const a2 = Math.cos(anim * 4 - PHASE * 2);
    const t2 = Math.cos(anim * 4 - PHASE * 2 - 1);
    ctx.translate(t2 * 7, 0);
    ctx.rotate(a2 * 0.15);
    ctx.beginPath();
    ctx.moveTo(-SW - 5, 0);
    ctx.lineTo(-SW - 5, 25);
    ctx.lineTo(-SW - 35, 31);
    ctx.moveTo(SW + 5, 0);
    ctx.lineTo(SW + 5, 25);
    ctx.lineTo(SW + 35, 31);
    ctx.fill();
    ctx.fillRect(-SW, -3, SW * 2, 30);
    const torsoXfm = ctx.getTransform();

    // Head
    const a1 = Math.cos(anim * 4 + 0);
    const t1 = Math.cos(anim * 4 + 0);
    ctx.translate(-t1 * 3.5 - Math.sin(arc * 0.3) * 4, -8);
    ctx.rotate(a1 * 0.15 - arc * 0.3);
    ctx.beginPath();
    ctx.moveTo(-SW, 0);
    ctx.lineTo(-SW * 0.6, -40);
    ctx.lineTo(SW * 0.6, -40);
    ctx.lineTo(SW, 0);
    ctx.fill();

    // Mid Torso
    ctx.setTransform(torsoXfm);
    const a3 = Math.cos(anim * 4 + 2.3);
    const t3 = Math.cos(anim * 4 + 1.3);
    ctx.translate(t3 * 2 - Math.sin(arc) * 4, 33);
    ctx.rotate(a3 * 0.2 + arc);
    ctx.fillRect(-SW * 0.8, 0, SW * 1.6, 30);

    // Torso-Tail
    const a4 = Math.cos(anim * 4 + 1.0);
    const t4 = Math.cos(anim * 4 + 1.0);
    ctx.translate(-t4 * 1, 36);
    ctx.rotate(a4 * 0.2 + arc);
    ctx.beginPath();
    ctx.moveTo(-SW * 0.7, 0);
    ctx.lineTo(0, 50);
    ctx.lineTo(SW * 0.7, 0);
    ctx.moveTo(-SW * 0.5 - 7, 2);
    ctx.lineTo(-SW * 0.5 - 5, 12);
    ctx.lineTo(-SW * 0.5 - 20, 12);
    ctx.moveTo(SW * 0.5 + 7, 2);
    ctx.lineTo(SW * 0.5 + 5, 12);
    ctx.lineTo(SW * 0.5 + 20, 12);
    ctx.fill();

    // Tail Fin
    const a5 = Math.cos(anim * 4 + 0.5);
    ctx.translate(0, 48);
    ctx.rotate(a5 * 0.3 + arc);
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.lineTo(-20, 22);
    ctx.lineTo(-2, 17);
    ctx.moveTo(2, 0);
    ctx.lineTo(20, 22);
    ctx.lineTo(2, 17);
    ctx.fill();

    ctx.setTransform(baseXfm);
  }

  return {
    update,
    render,
    getX,
    getY,
    getVX,
    getVY,
  };
};

export default Shark;