document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const squareSize = 60;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const colsBase = Math.ceil(screenWidth / squareSize);
  const rowsBase = Math.ceil(screenHeight / squareSize);

  // Extra squares so the grids cover fully
  const extra = Math.max(colsBase, rowsBase);
  const cols = colsBase + extra;
  const rows = rowsBase + extra;

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");

  const diagonal = Math.sqrt(screenWidth**2 + screenHeight**2);
  const extraDist = diagonal / 2;

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

  overlayTL.style.top = "0px";
  overlayTL.style.left = "0px";
  overlayTL.style.animation = `slide-in-tl ${SPEED}s forwards ease-out`;

  overlayBR.style.top = "0px";
  overlayBR.style.left = "0px";
  overlayBR.style.setProperty("--start-dist", `${screenWidth}px`);
  overlayBR.style.setProperty("--end-dist", `${extraDist}px`);
  overlayBR.style.animation = `slide-in-br ${SPEED}s forwards ease-out`;

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
