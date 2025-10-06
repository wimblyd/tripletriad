const GRID_COLS = 30;  // horizontal cells
const GRID_ROWS = 15;  // vertical cells
const ANIMATION_DURATION = 3000; // ms for full movement
const REDIRECT_DELAY = 4000; // ms before redirect after animation

const container = document.getElementById("computer-container");
const overlayTL = document.getElementById("overlay-tl");
const overlayBR = document.getElementById("overlay-br");

// Calculate Squares
function setupGrid() {
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  const squareWidth = containerWidth / GRID_COLS;
  const squareHeight = containerHeight / GRID_ROWS;

  // Gridmaker
  [overlayTL, overlayBR].forEach(overlay => {
    overlay.style.gridTemplateColumns = `repeat(${GRID_COLS}, ${squareWidth}px)`;
    overlay.style.gridTemplateRows = `repeat(${GRID_ROWS}, ${squareHeight}px)`;
  });

  buildGrid(overlayTL, true);
  buildGrid(overlayBR, false);

  overlayTL.style.width = `${containerWidth}px`;
  overlayTL.style.height = `${containerHeight}px`;
  overlayBR.style.width = `${containerWidth}px`;
  overlayBR.style.height = `${containerHeight}px`;

  overlayTL.style.top = "50%";
  overlayTL.style.left = "50%";
  overlayTL.style.transform = "translate(-50%, -50%)";
  overlayBR.style.top = "50%";
  overlayBR.style.left = "50%";
  overlayBR.style.transform = "translate(-50%, -50%)";
}

// Diagonal Cut
function buildGrid(overlay, isTopLayer) {
  overlay.innerHTML = ""; // clear

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const square = document.createElement("div");

      // Checkerboard
      const isFilled = (row + col) % 2 === 0;

      // Mask
      const diagonalCol = Math.floor((row / GRID_ROWS) * GRID_COLS);
      let visible;
      if (isTopLayer) {
        visible = col <= diagonalCol;
      } else {
        visible = col >= diagonalCol;
      }

      if (isFilled && visible) {
        square.style.backgroundColor = "black";
      } else {
        square.style.backgroundColor = "transparent";
      }

      overlay.appendChild(square);
    }
  }
}

// Animation
function runAnimation() {
  const moveX = container.offsetWidth * 0.5;
  const moveY = container.offsetHeight * 0.5;

  overlayTL.animate(
    [
      { transform: `translate(-50%, -50%) translate(-${moveX}px, -${moveY}px)` },
      { transform: "translate(-50%, -50%)" }
    ],
    { duration: ANIMATION_DURATION, easing: "ease-in-out", fill: "forwards" }
  );

  overlayBR.animate(
    [
      { transform: `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)` },
      { transform: "translate(-50%, -50%)" }
    ],
    { duration: ANIMATION_DURATION, easing: "ease-in-out", fill: "forwards" }
  );

  // Redirect
  setTimeout(() => {
    overlayTL.classList.add("fade-out");
    overlayBR.classList.add("fade-out");

    setTimeout(() => {
      window.location.href = "checklist.html";
    }, 1000);
  }, REDIRECT_DELAY);
}

// Initialize
window.addEventListener("load", () => {
  setupGrid();
  runAnimation();
});
