document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("transition-overlay");

  const SPEED = 0.4; // seconds
  const STEP = 30; // ms delay per diagonal step

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const diagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2); 
  const moveDistance = diagonal + 100; // extra to ensure full coverage

  const rows = Math.ceil(screenHeight / 30); 
  const cols = Math.ceil(screenWidth / 30); 

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
        square.style.setProperty("--move-dist", `${moveDistance}px`);

        square.style.animation = `move-br ${SPEED}s forwards ease-out`;
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
