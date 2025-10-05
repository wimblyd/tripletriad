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
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Use square cells that fit the shorter axis nicely
    const squareWidth = containerWidth / squaresAcross;
    const squareHeight = containerHeight / squaresDown;
    const squareSize = Math.min(squareWidth, squareHeight);

    container.style.setProperty("--square-size", `${squareSize}px`);

    const cols = Math.ceil(containerWidth / squareSize);
    const rows = Math.ceil(containerHeight / squareSize);

    const diagMultiplier = Math.SQRT2; // ~1.414
    const extraCols = Math.ceil(cols * diagMultiplier);
    const extraRows = Math.ceil(rows * diagMultiplier);

    const overlayTL = document.getElementById("overlay-tl");
    const overlayBR = document.getElementById("overlay-br");

    overlayTL.style.width = `${extraCols * squareSize}px`;
    overlayTL.style.height = `${extraRows * squareSize}px`;
    overlayBR.style.width = `${extraCols * squareSize}px`;
    overlayBR.style.height = `${extraRows * squareSize}px`;

    overlayTL.style.transform = `translate(-50%, -50%) rotate(45deg)`;
    overlayBR.style.transform = `translate(-50%, -50%) rotate(45deg)`;

    const travelX = containerWidth * diagMultiplier;
    const travelY = containerHeight * diagMultiplier;
    overlayTL.style.setProperty("--start-dist-x", `${travelX}px`);
    overlayTL.style.setProperty("--start-dist-y", `${travelY}px`);
    overlayBR.style.setProperty("--start-dist-x", `${travelX}px`);
    overlayBR.style.setProperty("--start-dist-y", `${travelY}px`);

    function makeChecker(containerElement, invert = false) {
      containerElement.innerHTML = "";
      containerElement.style.display = "grid";
      containerElement.style.gridTemplateColumns = `repeat(${extraCols}, ${squareSize}px)`;
      containerElement.style.gridTemplateRows = `repeat(${extraRows}, ${squareSize}px)`;

      for (let r = 0; r < extraRows; r++) {
        for (let c = 0; c < extraCols; c++) {
          const square = document.createElement("div");
          const isBlack = (r + c + (invert ? 1 : 0)) % 2 === 0;
          square.style.background = isBlack ? "black" : "transparent";
          containerElement.appendChild(square);
        }
      }
    }

    makeChecker(overlayTL, false);
    makeChecker(overlayBR, true);

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
