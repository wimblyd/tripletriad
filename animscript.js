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

  overlay.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
  overlay.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const square = document.createElement("div");

      const isBlack = (r + c) % 2 === 0;
      square.classList.add(isBlack ? "black" : "transparent");

      square.style.gridRow = r + 1;
      square.style.gridColumn = c + 1;

      const delay = (r + c) * STEP;
      square.style.setProperty("--move-dist", `${moveDistance}px`);
      square.style.animation = `wipe-in ${SPEED}s forwards ease-out`;
      square.style.animationDelay = `${delay}ms`;

      square.addEventListener("animationend", () => {
        finishedCount++;
        if (finishedCount === totalSquares) {
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

      overlay.appendChild(square);
    }
  }
});
