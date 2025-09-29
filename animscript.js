document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

  const rows = window.innerWidth < 769 ? 10 : 20; // match CSS
  const cols = rows; // make grid square
  let finishedCount = 0;
  const totalSquares = rows * cols;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const square = document.createElement("div");

      // Alternate classes for checkerboard
      square.classList.add((r + c) % 2 === 0 ? "wipe-br" : "wipe-tl");

      // Stagger delay so it moves diagonally
      square.style.animationDelay = `${(r + c) * 50}ms`;

      square.style.gridRow = r + 1;
      square.style.gridColumn = c + 1;

      overlay.appendChild(square);

      square.addEventListener("animationend", () => {
        finishedCount++;

        // When all squares finish
        if (finishedCount === totalSquares) {
          overlay.classList.add("fade-out");

          overlay.addEventListener("transitionend", () => {
            window.location.href = "checklist.html";
          }, { once: true });
        }
      });
    }
  }
});
