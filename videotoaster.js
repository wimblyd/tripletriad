document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const squareSize = 60;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const diagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
  const extraDist = diagonal / 2;

  // Add a buffer (in tiles) for overshoot coverage
  const bufferTiles = 3;

  // Full coverage in both directions
  const totalCoverage = diagonal + extraDist;
  const cols = Math.ceil(totalCoverage / squareSize) + bufferTiles;
  const rows = Math.ceil(totalCoverage / squareSize) + bufferTiles;

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");

  function makeDiagonalChecker(container, invert = false) {
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;
    container.style.position = "absolute";

    // Shift origin so the grid extends beyond all screen edges
    container.style.top = `-${squareSize * bufferTiles}px`;
    container.style.left = `-${squareSize * bufferTiles}px`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const square = document.createElement("div");
        const parity = (r + c) % 2 === 0;

        let isBlack;
        if (!invert) {
          isBlack = parity;
        } else {
          // invert pattern and shift one step to line up seamlessly
          isBlack = !parity;
        }

        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        square.style.background = isBlack ? "black" : "transparent";
        container.appendChild(square);
      }
    }
  }

  makeDiagonalChecker(overlayTL, false);
  makeDiagonalChecker(overlayBR, true);

  // Align starting points and animations
  overlayTL.style.animation = `slide-in-tl ${SPEED}s forwards ease-out`;
  overlayBR.style.animation = `slide-in-br ${SPEED}s forwards ease-out`;

  overlayBR.style.setProperty("--start-dist", `${screenWidth}px`);
  overlayBR.style.setProperty("--end-dist", `${extraDist}px`);

  // Redirect when both animations finish
  let animationsFinished = 0;
  function checkRedirect() {
    animationsFinished++;
    if (animationsFinished === 2) {
      window.location.href = "checklist.html";
    }
  }

  overlayTL.addEventListener("animationend", checkRedirect, { once: true });
  overlayBR.addEventListener("animationend", checkRedirect, { once: true });
});
