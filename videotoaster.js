document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const squareSize = 60;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const cols = Math.ceil(Math.max(screenWidth, screenHeight) / squareSize);
  const rows = cols;

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");

  // Viewport Calculation
  const maxDim = Math.max(screenWidth, screenHeight);
  const startDist = maxDim * 0.6; // where animation starts (offscreen)
  const endDist = maxDim * 1.2;   // how far it travels diagonally

  // Checkerboard Builder
  function makeDiagonalChecker(container, invert = false) {
    container.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;
    container.style.position = "absolute";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const square = document.createElement("div");

        let isBlack;
        if (!invert) {
          isBlack = c < cols - r && (r + c) % 2 === 0;
        } else {
          isBlack = c >= cols - r - 1 && (r + c + 1) % 2 === 0;
        }

        square.style.background = isBlack ? "black" : "transparent";
        container.appendChild(square);
      }
    }
  }

  makeDiagonalChecker(overlayTL, false);
  makeDiagonalChecker(overlayBR, true);

  // Position Animation
  overlayTL.style.top = "0px";
  overlayTL.style.left = "0px";
  overlayTL.style.setProperty("--start-dist", `${startDist}px`);
  overlayTL.style.setProperty("--end-dist", `${endDist}px`);
  overlayTL.style.animation = `slide-in-tl ${SPEED}s forwards ease-out`;

  overlayBR.style.top = "0px";
  overlayBR.style.left = "0px";
  overlayBR.style.setProperty("--start-dist", `${startDist}px`);
  overlayBR.style.setProperty("--end-dist", `${endDist}px`);
  overlayBR.style.animation = `slide-in-br ${SPEED}s forwards ease-out`;

  // Redirect
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
