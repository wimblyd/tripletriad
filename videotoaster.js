document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const HOLD_TIME = 0.4;
  const FADE_TIME = 0.6;
  const squareSize = 60;

  const frameImage = document.getElementById("computer");
  const container = document.getElementById("computer-container");

  const leftPercent = 0.08;
  const topPercent = 0.04;
  const rightPercent = 0.08;
  const bottomPercent = 0.04;

  frameImage.addEventListener("load", () => {
    const rect = frameImage.getBoundingClientRect();

    const containerLeft = rect.left + rect.width * leftPercent;
    const containerTop = rect.top + rect.height * topPercent;
    const containerWidth = rect.width * (1 - leftPercent - rightPercent);
    const containerHeight = rect.height * (1 - topPercent - bottomPercent);

    container.style.position = "absolute";
    container.style.left = `${containerLeft}px`;
    container.style.top = `${containerTop}px`;
    container.style.width = `${containerWidth}px`;
    container.style.height = `${containerHeight}px`;

    const cols = Math.ceil(containerWidth / squareSize);
    const rows = Math.ceil(containerHeight / squareSize);

    const wedgeExtraSquares = Math.ceil(Math.min(cols, rows) / 2);

    const overlayTL = document.getElementById("overlay-tl");
    const overlayBR = document.getElementById("overlay-br");

    overlayTL.style.setProperty("--start-dist-x", `${containerWidth}px`);
    overlayTL.style.setProperty("--start-dist-y", `${containerHeight}px`);
    overlayBR.style.setProperty("--start-dist-x", `${containerWidth}px`);
    overlayBR.style.setProperty("--start-dist-y", `${containerHeight}px`);

    let extraSquaresAdded = 0;

    function makeDiagonalChecker(containerElement, invert = false, extraSquares = 0) {
      const totalCols = cols + extraSquares;
      const totalRows = rows + extraSquares;

      containerElement.style.gridTemplateColumns = `repeat(${totalCols}, ${squareSize}px)`;
      containerElement.style.gridTemplateRows = `repeat(${totalRows}, ${squareSize}px)`;
      containerElement.style.position = "absolute";
      containerElement.innerHTML = "";

      for (let r = 0; r < totalRows; r++) {
        for (let c = 0; c < totalCols; c++) {
          const square = document.createElement("div");
          let isBlack;

          if (!invert) {
            isBlack = (r + c) % 2 === 0 && c < totalCols - r;
          } else {
            isBlack = (r + c) % 2 !== 0 && c >= totalCols - r;
          }

          square.style.width = `${squareSize}px`;
          square.style.height = `${squareSize}px`;
          square.style.background = isBlack ? "black" : "transparent";
          containerElement.appendChild(square);
        }
      }
    }

    makeDiagonalChecker(overlayTL, false, 0);
    makeDiagonalChecker(overlayBR, true, 0);

    function growGrid() {
      if (extraSquaresAdded < wedgeExtraSquares) {
        extraSquaresAdded++;
        makeDiagonalChecker(overlayTL, false, extraSquaresAdded);
        makeDiagonalChecker(overlayBR, true, extraSquaresAdded);

        requestAnimationFrame(growGrid);
      }
    }

    overlayTL.style.animation = `slide-in-tl ${SPEED}s forwards ease-in-out`;
    overlayBR.style.animation = `slide-in-br ${SPEED}s forwards ease-in-out`;
    growGrid();

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
});
