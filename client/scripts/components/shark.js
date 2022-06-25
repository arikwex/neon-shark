const SKIN_COLOR = '#57a';
const SW = 17;
const PHASE = 1.1;

function Shark() {
  let x = 0;
  let y = 0;
  let anim = 0;

  function update(dT) {
    anim += dT * 2;
  }

  function render(ctx) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.75, 0.75);
    ctx.fillStyle = SKIN_COLOR;

    const xfm = ctx.getTransform();
    const arc = 0.0;

    // Head
    const a1 = Math.cos(anim * 4 - PHASE * 1) + arc * 0;
    const t1 = Math.cos(anim * 4 - PHASE * 1 + 1);
    ctx.translate(-t1 * 6, -55);
    ctx.rotate(a1 * 0.1);
    ctx.beginPath();
    ctx.moveTo(-SW, 20);
    ctx.lineTo(-SW * 0.6, -20);
    ctx.lineTo(SW * 0.6, -20);
    ctx.lineTo(SW, 20);
    ctx.fill();

    // Upper Torso
    ctx.setTransform(xfm);
    const a2 = Math.cos(anim * 4 - PHASE * 2) + arc * 1;
    const t2 = Math.cos(anim * 4 - PHASE * 2 + 1);
    ctx.translate(-t2 * 6, -15);
    ctx.rotate(a2 * 0.15);
    ctx.beginPath();
    ctx.moveTo(-SW - 5, -27+15);
    ctx.lineTo(-SW - 5, -2+15);
    ctx.lineTo(-SW - 40, 3+15);
    ctx.moveTo(SW + 5, -27+15);
    ctx.lineTo(SW + 5, -2+15);
    ctx.lineTo(SW + 40, 3+15);
    ctx.fill();
    ctx.fillRect(-SW, -30+15, SW * 2, 30);

    // Mid Torso
    ctx.setTransform(xfm);
    const a3 = Math.cos(anim * 4 - PHASE * 3) + arc * 2;
    const t3 = Math.cos(anim * 4 - PHASE * 3 + 1);
    ctx.translate(-t3 * 7, 18);
    ctx.rotate(a3 * 0.2);
    ctx.fillRect(-SW * 0.8, 5-18, SW * 1.6, 30);

    // Torso-Tail
    ctx.setTransform(xfm);
    const a4 = Math.cos(anim * 4 - PHASE * 4) + arc * 3;
    const t4 = Math.cos(anim * 4 - PHASE * 4 + 1);
    ctx.translate(-t4 * 12, 70);
    ctx.rotate(a4 * 0.25);
    ctx.beginPath();
    ctx.moveTo(-SW * 0.7, -30);
    ctx.lineTo(0, 20);
    ctx.lineTo(SW * 0.7, -30);
    ctx.moveTo(-SW * 0.5 - 7, 42-70);
    ctx.lineTo(-SW * 0.5 - 5, 52-70);
    ctx.lineTo(-SW * 0.5 - 20, 52-70);
    ctx.moveTo(SW * 0.5 + 7, 42-70);
    ctx.lineTo(SW * 0.5 + 5, 52-70);
    ctx.lineTo(SW * 0.5 + 20, 52-70);
    ctx.fill();

    // Tail Fin
    // ctx.setTransform(xfm);
    const a5 = Math.cos(anim * 4 - PHASE * 5) + arc * 4;
    ctx.rotate(a5 * 0.2);
    ctx.translate(0, 35);
    ctx.beginPath();
    ctx.moveTo(-2, 93-110);
    ctx.lineTo(-20, 120-110);
    ctx.lineTo(-2, 110-110);
    ctx.moveTo(2, 93-110);
    ctx.lineTo(20, 120-110);
    ctx.lineTo(2, 110-110);
    ctx.fill();

    ctx.restore();
  }

  return {
    update,
    render,
  };
};

export default Shark;