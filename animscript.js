document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

  const SPEED = 0.4;
  const STEP = 30;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const diagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
  const moveDistance = diagonal + 100;

  const squareSize = 30;
  const extra = 4; 
  const rows = Math.ceil(screenHeight / squareSize) + extra;
  const cols = Math.ceil(screenWidth / squareSize) + extra;

  let finishedCount = 0;
  const totalSquares = rows * cols;

  overlay.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
  overlay.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const square = document.createElement("div");

    const isBlack = (r + c) % 2 === 0;
    square.classList.add(isBlack ? "black" : "transparent");

    square.style.gridRow = r + 1;
    square.style.gridColumn = c + 1;

    const isTopLeft = isBlack;
    const delay = (isTopLeft ? (r + c) : (rows + cols - r - c)) * STEP;

    square.style.setProperty("--move-dist", `${moveDistance}px`);
    square.style.animation = isTopLeft
      ? `wipe-in-tl ${SPEED}s forwards ease-out`
      : `wipe-in-br ${SPEED}s forwards ease-out`;
    square.style.animationDelay = `${delay}ms`;

    overlay.appendChild(square);
  }
}
});
