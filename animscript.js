document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

  const SPEED = 0.8; // seconds
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const diagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
  const moveDistance = diagonal + 100;

  const squareSize = 30;
  const extra = 4; 
  const rows = Math.ceil(screenHeight / squareSize) + extra;
  const cols = Math.ceil(screenWidth / squareSize) + extra;

  let finishedCount = 0;
  const totalSquares = rows * cols;

  overlay.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
  overlay.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const square = document.createElement("div");

      const isBlack = (r + c) % 2 === 0;
      square.classList.add(isBlack ? "black" : "transparent");

      // Use CSS variable for responsive distance
      square.style.setProperty("--move-dist", `${moveDistance}px`);

      // All squares animate together (no delay)
      square.style.animation = isBlack
        ? `slide-out-tl ${SPEED}s forwards ease-out`
        : `slide-out-br ${SPEED}s forwards ease-out`;

      square.addEventListener("animationend", () => {
        finishedCount++;
        if (finishedCount === totalSquares) {
          overlay.classList.add("fade-out");
          overlay.addEventListener("transitionend", () => {
            window.location.href = "checklist.html";
          }, { once: true });
        }
      });

      overlay.appendChild(square);
    }
  }
});
