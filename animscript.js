document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

  const SPEED = 0.4; // seconds per square
  const STEP = 30; // ms delay per diagonal step

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const diagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
  const moveDistance = diagonal + 100;

  const squareSize = 30; 
  const rows = Math.ceil(screenHeight / squareSize);
  const cols = Math.ceil(screenWidth / squareSize);

  let finishedCount = 0;
  const totalSquares = rows * cols;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const square = document.createElement("div");

      const isBlack = (r + c) % 2 === 0;
      square.classList.add(isBlack ? "black" : "transparent");

      square.style.gridRow = r + 1;
      square.style.gridColumn = c + 1;

      // Animation for black squares only
      if (isBlack) {
        const delay = (r + c) * STEP;
        square.style.setProperty("--move-dist", `${moveDistance}px`);

        // Alternate movement direction for a diagonal wipe
        const direction = (r + c) % 4 === 0 ? "move-br" : "move-tl";
        square.style.animation = `${direction} ${SPEED}s forwards ease-out`;
        square.style.animationDelay = `${delay}ms`;

        square.addEventListener("animationend", () => {
          finishedCount++;
          // Transition once all animated squares are done
          if (finishedCount === Math.ceil(totalSquares / 2)) {
            overlay.classList.add("fade-out");
            overlay.addEventListener(
              "transitionend",
              () => {
                window.location.href = "checklist.html";
              },
              { once: true }
            );
          }
        });
      }

      overlay.appendChild(square);
    }
  }
});
