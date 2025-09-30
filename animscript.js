document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 0.8; // seconds
  const squareSize = 30;
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const cols = Math.ceil(screenWidth / squareSize) + 2;
  const rows = Math.ceil(screenHeight / squareSize) + 2;

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

  // TL grid (normal pattern)
  makeChecker(overlayTL, false);
  overlayTL.style.top = "0";
  overlayTL.style.left = "0";
  overlayTL.style.animation = `slide-in-tl ${SPEED}s forwards ease-out`;

  // BR grid (offset pattern)
  makeChecker(overlayBR, true);
  overlayBR.style.top = "0";
  overlayBR.style.left = "0";
  overlayBR.style.animation = `slide-in-br ${SPEED}s forwards ease-out`;

  // Fade & redirect once BR animation finishes
  overlayBR.addEventListener("animationend", () => {
    overlayTL.style.transition = "opacity 0.8s ease-out";
    overlayBR.style.transition = "opacity 0.8s ease-out";
    overlayTL.style.opacity = 0;
    overlayBR.style.opacity = 0;

    overlayBR.addEventListener("transitionend", () => {
      window.location.href = "checklist.html";
    }, { once: true });
  });
});
