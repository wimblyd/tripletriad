document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0; // seconds for slow weave
  const squareSize = 60; // bigger squares

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const cols = Math.ceil(screenWidth / squareSize);
  const rows = Math.ceil(screenHeight / squareSize);

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");

  function makeDiagonalChecker(container, invert = false) {
    container.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;
    container.style.position = "absolute";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const square = document.createElement("div");
        const isBlack = (r + c + (invert ? 1 : 0)) % 2 === 0;
        square.style.background = isBlack ? "black" : "transparent";

        // Shift every row by a full square length alternately
        if (r % 2 === 1) {
          square.style.transform = `translateX(${squareSize}px)`;
        }

        container.appendChild(square);
      }
    }
  }

  makeDiagonalChecker(overlayTL, false); // TL normal pattern
  makeDiagonalChecker(overlayBR, true);  // BR inverted pattern

  overlayTL.style.top = "0";
  overlayTL.style.left = "0";
  overlayTL.style.animation = `slide-in-tl ${SPEED}s forwards ease-out`;

  overlayBR.style.top = "0";
  overlayBR.style.left = "0";
  overlayBR.style.animation = `slide-in-br ${SPEED}s forwards ease-out`;

  // Redirect after both animations finish
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
