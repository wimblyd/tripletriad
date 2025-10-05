document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const HOLD_TIME = 0.4;
  const FADE_TIME = 0.6;
  const squareSize = 60;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const colsBase = Math.ceil(screenWidth / squareSize);
  const rowsBase = Math.ceil(screenHeight / squareSize);

  const diagonal = Math.sqrt(screenWidth**2 + screenHeight**2);
  const extraSquares = Math.ceil(diagonal / squareSize) + 2;

  const cols = colsBase + extraSquares;
  const rows = rowsBase + extraSquares;

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");

  const maxDim = Math.max(screenWidth, screenHeight);
  const startDist = maxDim * 0.6;
  const endDist = diagonal * 1.2;

  function makeDiagonalChecker(container, invert = false) {
    container.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;
    container.style.position = "absolute";
    container.innerHTML = "";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const square = document.createElement("div");
        let isBlack;

        if (!invert) {
          isBlack = (r + c) % 2 === 0 && c < cols - r;
        } else {
          isBlack = (r + c + 1) % 2 === 0 && c >= cols - r - 1;
        }

        square.style.background = isBlack ? "black" : "transparent";
        container.appendChild(square);
      }
    }
  }

  makeDiagonalChecker(overlayTL, false);
  makeDiagonalChecker(overlayBR, true);

  overlayTL.style.setProperty("--start-dist", `${startDist}px`);
  overlayTL.style.setProperty("--end-dist", `${endDist}px`);
  overlayBR.style.setProperty("--start-dist", `${startDist}px`);
  overlayBR.style.setProperty("--end-dist", `${endDist}px`);

  overlayTL.style.animation = `slide-in-tl ${SPEED}s forwards ease-in-out`;
  overlayBR.style.animation = `slide-in-br ${SPEED}s forwards ease-in-out`;

  let animationsFinished = 0;

  function checkRedirect() {
    animationsFinished++;
    if (animationsFinished === 2) {
      setTimeout(() => {
        overlayTL.classList.add("fade-out");
        overlayBR.classList.add("fade-out");

        setTimeout(() => {
          window.location.href = "checklist.html";
        }, FADE_TIME * 1000);
      }, HOLD_TIME * 1000);
    }
  }

  overlayTL.addEventListener("animationend", checkRedirect, { once: true });
  overlayBR.addEventListener("animationend", checkRedirect, { once: true });
});
