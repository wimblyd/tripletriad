document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;       
  const HOLD_TIME = 0.4;   
  const FADE_TIME = 0.6;  
  const REDIRECT_URL = "checklist.html";

  const squaresAcross = 30;
  const squaresDown = 15;

  const frameImage = document.getElementById("computer");
  const container = document.getElementById("computer-container");

  frameImage.addEventListener("load", () => {
    const rect = frameImage.getBoundingClientRect();

    // Calculate container
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Grid
    const squareWidth = containerWidth / squaresAcross;
    const squareHeight = containerHeight / squaresDown;
    const squareSize = Math.min(squareWidth, squareHeight);

    container.style.setProperty("--square-size", `${squareSize}px`);

    const cols = Math.ceil(containerWidth / squareSize);
    const rows = Math.ceil(containerHeight / squareSize);

    const wedgeExtraSquares = Math.ceil(Math.min(cols, rows) / 2);
    const wedgeOffset = wedgeExtraSquares * squareSize;

    const overlayTL = document.getElementById("overlay-tl");
    const overlayBR = document.getElementById("overlay-br");

    overlayTL.style.setProperty("--start-dist-x", `${containerWidth + wedgeOffset}px`);
    overlayTL.style.setProperty("--start-dist-y", `${containerHeight + wedgeOffset}px`);
    overlayBR.style.setProperty("--start-dist-x", `${containerWidth + wedgeOffset}px`);
    overlayBR.style.setProperty("--start-dist-y", `${containerHeight + wedgeOffset}px`);

    function makeDiagonalChecker(containerElement, invert = false, extraSquares = 0) {
      const totalCols = cols + extraSquares;
      const totalRows = rows + extraSquares;

      containerElement.style.gridTemplateColumns = `repeat(${totalCols}, ${squareSize}px)`;
      containerElement.style.gridTemplateRows = `repeat(${totalRows}, ${squareSize}px)`;
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

    makeDiagonalChecker(overlayTL, false, wedgeExtraSquares);
    makeDiagonalChecker(overlayBR, true, wedgeExtraSquares);

    // Animate
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
            window.location.href = REDIRECT_URL;
          }, FADE_TIME * 1000);
        }, HOLD_TIME * 1000);
      }
    }

    overlayTL.addEventListener("animationend", checkRedirect, { once: true });
    overlayBR.addEventListener("animationend", checkRedirect, { once: true });
  });
});
