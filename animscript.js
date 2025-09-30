document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 0.8; // seconds
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const diagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
  const moveDistance = diagonal + 100;

  const squareSize = 30;
  const extra = 4;
  const rows = Math.ceil(screenHeight / squareSize) + extra;
  const cols = Math.ceil(screenWidth / squareSize) + extra;

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");

  let finishedCount = 0;
  const totalSquares = rows * cols; // per overlay
  const totalAnimations = totalSquares * 2; // both overlays combined

  function makeGrid(container, direction) {
    container.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    container.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const square = document.createElement("div");
        square.style.setProperty("--move-dist", `${moveDistance}px`);

        // Each overlay animates a checkerboard offset
        if ((r + c) % 2 === (direction === "tl" ? 0 : 1)) {
          square.style.animation =
            direction === "tl"
              ? `slide-out-tl ${SPEED}s forwards ease-out`
              : `slide-out-br ${SPEED}s forwards ease-out`;

          square.addEventListener("animationend", () => {
            finishedCount++;
            if (finishedCount === totalAnimations) {
              overlayTL.classList.add("fade-out");
              overlayBR.classList.add("fade-out");

              // Redirect after fade-out
              overlayTL.addEventListener(
                "transitionend",
                () => {
                  window.location.href = "checklist.html";
                },
                { once: true }
              );
            }
          });
        } else {
          // Fill in gaps with transparent placeholders
          square.style.background = "transparent";
        }

        container.appendChild(square);
      }
    }
  }

  makeGrid(overlayTL, "tl");
  makeGrid(overlayBR, "br");
});
