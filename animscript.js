document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

  // ===== Adjustable settings =====
  const SPEED = 0.5;   // seconds for each square’s move
  const STEP  = 40;    // ms delay between diagonals

  const rows = window.innerWidth < 769 ? 10 : 20;
  const cols = rows; 
  let finishedCount = 0;
  const totalSquares = rows * cols;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const square = document.createElement("div");

      // Checkerboard pattern
      const isBlack = (r + c) % 2 === 0;
      square.classList.add(isBlack ? "black" : "transparent");

      square.style.gridRow = r + 1;
      square.style.gridColumn = c + 1;

      // Animate black squares only
      if (isBlack) {
        const delay = (r + c) * STEP; 

        if (r + c < rows) {
          // top-left half → move down-right
          square.style.animation = `move-br ${SPEED}s forwards ease-out`;
        } else {
          // bottom-right half → move up-left
          square.style.animation = `move-tl ${SPEED}s forwards ease-out`;
        }
        square.style.animationDelay = `${delay}ms`;

        square.addEventListener("animationend", () => {
          finishedCount++;
          if (finishedCount === Math.ceil(totalSquares / 2)) {
            overlay.classList.add("fade-out");
            overlay.addEventListener(
              "transitionend",
              () => {
                document.body.style.backgroundImage =
                  'url("img/GardenFestivalBkg.jpg")';
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
