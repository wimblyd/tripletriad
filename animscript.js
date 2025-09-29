const rows = 12;
const cols = 20;
let finishedCount = 0;
const totalSquares = rows * cols;

const overlay = document.getElementById("transition-overlay");

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const square = document.createElement("div");
    square.classList.add(Math.random() > 0.5 ? "wipe-br" : "wipe-tl");
    square.style.animationDelay = `${(r + c) * 50}ms`;
    square.style.gridRow = r + 1;
    square.style.gridColumn = c + 1;
    overlay.appendChild(square);

    square.addEventListener("animationend", () => {
      finishedCount++;

      // Redirect immediately after last animation
      if (finishedCount === totalSquares) {
        overlay.classList.add("fade-out");

        // Listen for fade-out animation end before redirect
        overlay.addEventListener("transitionend", () => {
          window.location.href = "checklist.html";
        }, { once: true });
      }
    });
  }
}
