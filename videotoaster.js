document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const HOLD_TIME = 0.4;
  const FADE_TIME = 0.6;
  const squareSize = 60;

  const frameImage = document.getElementById("computer");
  const container = document.getElementById("computer-container");

  const rectXPercent = 0.1;
  const rectYPercent = 0.1;
  const rectWidthPercent = 0.8;
  const rectHeightPercent = 0.8;

  frameImage.addEventListener("load", () => {
    const rect = frameImage.getBoundingClientRect();

    container.style.position = "absolute";
    container.style.left = `${rect.left + rect.width * rectXPercent}px`;
    container.style.top = `${rect.top + rect.height * rectYPercent}px`;
    container.style.width = `${rect.width * rectWidthPercent}px`;
    container.style.height = `${rect.height * rectHeightPercent}px`;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const colsBase = Math.ceil(containerWidth / squareSize);
    const rowsBase = Math.ceil(containerHeight / squareSize);

    const diagonal = Math.sqrt(containerWidth ** 2 + containerHeight ** 2);
    const extraSquares = Math.ceil(diagonal / squareSize) + 1;

    const cols = colsBase + extraSquares;
    const rows = rowsBase + extraSquares;

    const overlayTL = document.getElementById("overlay-tl");
    const overlayBR = document.getElementById("overlay-br");

    const startDist = Math.max(containerWidth, containerHeight) * 0.6;
    const endDist = diagonal * 1.2;

    overlayTL.style.setProperty("--start-dist", `${startDist}px`);
    overlayTL.style.setProperty("--end-dist", `${endDist}px`);
    overlayBR.style.setProperty("--start-dist", `${startDist}px`);
    overlayBR.style.setProperty("--end-dist", `${endDist}px`);

    function makeDiagonalChecker(containerElement, invert = false) {
      containerElement.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
      containerElement.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;
      containerElement.style.position = "absolute";
      containerElement.innerHTML = "";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const square = document.createElement("div");
          let isBlack;

          if (!invert) {
            isBlack = (r + c) % 2 === 0 && c < cols - r;
          } else {
            isBlack = (r + c + 1) % 2 === 0 && c >= cols - r - 1;
          }

          square.style.width = `${squareSize}px`;
          square.style.height = `${squareSize}px`;
          square.style.background = isBlack ? "black" : "transparent";
          containerElement.appendChild(square);
        }
      }
    }

    makeDiagonalChecker(overlayTL, false);
    makeDiagonalChecker(overlayBR, true);

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
});
