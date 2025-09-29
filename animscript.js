document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

  const rows = window.innerWidth < 769 ? 10 : 20;
  const cols = rows; // make square grid
  let finishedCount = 0;
  const totalSquares = rows * cols;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const square = document.createElement("div");

      // Alternate squares: checkerboard pattern
      if ((r + c) % 2 === 0) {
        square.classList.add("black");
      } else {
        square.classList.add("transparent");
      }

      square.style.gridRow = r + 1;
      square.style.gridColumn = c + 1;

      overlay.appendChild(square);

      square.addEventListener("animationend", () => {
        finishedCount++;
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
