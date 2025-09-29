document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

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

      // Only animate black squares
      if (isBlack) {
        // Diagonal index for stagger
        const delay = (r + c) * 80; 

        // Decide direction: top-left half vs bottom-right half
        if (r + c < rows) {
          square.style.animation = `move-br 0.8s forwards ease-out`;
        } else {
          square.style.animation = `move-tl 0.8s forwards ease-out`;
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
