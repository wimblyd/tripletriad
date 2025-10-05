// Config
const speed = 4; // pixels per frame
const colorA = "#000"; // black
const colorB = "transparent"; // transparent

// Setup
const canvas = document.createElement("canvas");
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
canvas.style.display = "block";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

// Sizing
let squareSize, cols, rows, maxOffset;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  squareSize = Math.floor(Math.min(canvas.width, canvas.height) / 10);
  cols = Math.ceil(canvas.width / squareSize) * 2;
  rows = Math.ceil(canvas.height / squareSize) * 2;
  maxOffset = Math.max(canvas.width, canvas.height) * 1.5;
}
resize();
window.addEventListener("resize", resize);

// Grid
function drawTriangle(originX, originY, direction = 1) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // Determine if square lies in the triangular region
      const inTriangle =
        direction === 1
          ? y >= x // top-left → down-right
          : y <= rows - x; // bottom-right → up-left

      if (inTriangle) {
        const isBlack = (x + y) % 2 === 0;
        ctx.fillStyle = isBlack ? colorA : colorB;
        ctx.fillRect(
          originX + x * squareSize,
          originY + y * squareSize,
          squareSize,
          squareSize
        );
      }
    }
  }
}

// Loop
let offset = 0;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw top-left triangle
  drawTriangle(-cols * squareSize + offset, -rows * squareSize + offset, 1);

  // draw bottom-right triangle
  drawTriangle(canvas.width - offset, canvas.height - offset, -1);

  offset += speed;

  if (offset < maxOffset) {
    requestAnimationFrame(animate);
  } else {
    
    ctx.fillStyle = colorA;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

animate();
