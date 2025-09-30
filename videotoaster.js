document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const squareSize = 60;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const cols = Math.ceil(screenWidth / squareSize);
  const rows = Math.ceil(screenHeight / squareSize);

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");

  function makeChecker(container, invert = false) {
    container.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const square = document.createElement("div");
        const isBlack = (r + c) % 2 === (invert ? 1 : 0);
        square.style.background = isBlack ? "black" : "transparent";
        container.appendChild(square);
      }
    }
  }

  makeChecker(overlayTL, false); // normal pattern
  makeChecker(overlayBR, true);  // offset pattern

  overlayTL.style.top = "0";
  overlayTL.style.left = "0";
  overlayTL.style.animation = `slide-in-tl ${SPEED}s forwards ease-out`;

  overlayBR.style.top = "0";
  overlayBR.style.left = "0";
  overlayBR.style.animation = `slide-in-br ${SPEED}s forwards ease-out`;

  let animationsFinished = 0;
  function checkRedirect() {
    animationsFinished++;
    if (animationsFinished === 2) { // both overlays done
      window.location.href = "checklist.html";
    }
  }

  overlayTL.addEventListener("animationend", checkRedirect, { once: true });
  overlayBR.addEventListener("animationend", checkRedirect, { once: true });
});
