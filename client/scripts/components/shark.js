const SKIN_COLOR = '#57a';
const SW = 17;

function Shark() {
  let x = 0;
  let y = 0;

  function update(dT) {
  }

  function render(ctx) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(0.75, 0.75);
    ctx.fillStyle = SKIN_COLOR;

    ctx.beginPath();
    ctx.moveTo(-SW, -35);
    ctx.lineTo(-SW * 0.6, -75);
    ctx.lineTo(SW * 0.6, -75);
    ctx.lineTo(SW, -35);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-SW - 5, -27);
    ctx.lineTo(-SW - 5, -2);
    ctx.lineTo(-SW - 40, 3);
    ctx.moveTo(SW + 5, -27);
    ctx.lineTo(SW + 5, -2);
    ctx.lineTo(SW + 40, 3);
    ctx.fill();

    ctx.fillRect(-SW, -30, SW * 2, 30);

    ctx.fillRect(-SW * 0.8, 5, SW * 1.6, 30);

    ctx.beginPath();
    ctx.moveTo(-SW * 0.7, 40);
    ctx.lineTo(0, 90);
    ctx.lineTo(SW * 0.7, 40);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-SW * 0.5 - 7, 42);
    ctx.lineTo(-SW * 0.5 - 5, 52);
    ctx.lineTo(-SW * 0.5 - 20, 52);
    ctx.moveTo(SW * 0.5 + 7, 42);
    ctx.lineTo(SW * 0.5 + 5, 52);
    ctx.lineTo(SW * 0.5 + 20, 52);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-2, 93);
    ctx.lineTo(-30, 120);
    ctx.lineTo(-2, 110);
    ctx.moveTo(2, 93);
    ctx.lineTo(30, 120);
    ctx.lineTo(2, 110);
    ctx.fill();

    ctx.restore();
  }

  return {
    update,
    render,
  };
};

export default Shark;