window.addEventListener("load", () => {
  const GRID_COLS = 30;
  const GRID_ROWS = 15;
  const DIAGONAL_DELAY = 40;
  const REDIRECT_URL = "checklist.html";
  const MAX_DIAGONAL = GRID_ROWS + GRID_COLS - 2;

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");
  const container = document.getElementById("computer-container");

  if (!overlayTL || !overlayBR || !container) return;

  function isMobile() {
    return (
      window.matchMedia("(max-aspect-ratio: 9/16)").matches ||
      window.innerWidth < 768
    );
  }

  if (isMobile()) {
    window.location.replace(REDIRECT_URL);
    return;
  }

  const squareSize = Math.ceil(
    Math.max(container.offsetWidth / GRID_COLS, container.offsetHeight / GRID_ROWS)
  );

  // I wonder what it's like to be the Gridmaker
  function createGrid(el) {
    el.innerHTML = "";
    el.style.display = "grid";
    el.style.gridTemplateColumns = `repeat(${GRID_COLS}, ${squareSize}px)`;
    el.style.gridTemplateRows = `repeat(${GRID_ROWS}, ${squareSize}px)`;
    el.style.width = `${GRID_COLS * squareSize}px`;
    el.style.height = `${GRID_ROWS * squareSize}px`;

    const grid = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < GRID_COLS; c++) {
        const cell = document.createElement("div");
        cell.style.width = `${squareSize}px`;
        cell.style.height = `${squareSize}px`;
        cell.style.background = "transparent";
        el.appendChild(cell);
        grid[r][c] = cell;
      }
    }
    return grid;
  }

  const gridTL = createGrid(overlayTL);
  const gridBR = createGrid(overlayBR);

  // Vincenzo Natali's 'The Cube'
  function fillCell(cell, condition) {
    if (condition && cell.style.background === "transparent") {
      cell.style.background = "black";
    }
  }

  let step = 0;

  // Wipe In
  function diagonalStep() {
    for (let r = 0; r < GRID_ROWS; r++) {
      const cTL = step - r;
      const cBR = step - r;

      if (cTL >= 0 && cTL < GRID_COLS) {
        fillCell(gridTL[r][cTL], (r + cTL) % 2 === 0);
      }

      if (cBR >= 0 && cBR < GRID_COLS) {
        const brRow = GRID_ROWS - 1 - r;
        const brCol = GRID_COLS - 1 - cBR;
        fillCell(gridBR[brRow][brCol], (brRow + brCol + 1) % 2 === 0);
      }
    }

    step++;
    if (step <= MAX_DIAGONAL) {
      setTimeout(diagonalStep, DIAGONAL_DELAY);
    } else {
      reverseFill();
    }
  }

  // Whahaahahowaa Wipe Out
  function reverseFill() {
    let reverseStep = 0;
    const reverseMax = Math.floor(MAX_DIAGONAL / 2);

    function fillReverse() {
      for (let r = 0; r < GRID_ROWS; r++) {
        const c = reverseMax - reverseStep - r;
        if (c >= 0 && c < GRID_COLS) {
          fillCell(gridTL[r][c], (r + c) % 2 !== 0);

          const brRow = GRID_ROWS - 1 - r;
          const brCol = GRID_COLS - 1 - c;
          fillCell(gridBR[brRow][brCol], (brRow + brCol + 1) % 2 !== 0);
        }
      }

      reverseStep++;
      if (reverseStep <= reverseMax) {
        setTimeout(fillReverse, DIAGONAL_DELAY);
      } else {
        redirect();
      }
    }
    fillReverse();
  }

  // Fade out Redirect
  function redirect() {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = 0;
    setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, 500);
  }

  // 🧭 Center overlays precisely
  [overlayTL, overlayBR].forEach((el) => {
    el.style.position = "absolute";
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = "translate(-50%, -50%)";
    el.style.zIndex = "1";
  });

  // Did you ever know that I had mine on you....
  const observer = new ResizeObserver(() => {
    observer.disconnect();
    diagonalStep();
  });
  observer.observe(container);
});
