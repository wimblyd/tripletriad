document.addEventListener("DOMContentLoaded", () => {
  const DEBUG = true; // toggle outlines and slower animation
  const GRID_COLS = 30;
  const GRID_ROWS = 15;
  const DIAGONAL_DELAY = DEBUG ? 100 : 40;
  const FADE_TIME = 600;
  const REDIRECT_URL = "checklist.html";

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");
  const container = document.getElementById("computer-container");

  if (!overlayTL || !overlayBR || !container) return;

  const squareSize = Math.max(container.offsetWidth / GRID_COLS, container.offsetHeight / GRID_ROWS);

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
        if (DEBUG) cell.style.outline = "1px solid rgba(255,255,255,0.1)";
        el.appendChild(cell);
        grid[r][c] = cell;
      }
    }
    return grid;
  }

  const gridTL = createGrid(overlayTL);
  const gridBR = createGrid(overlayBR);

  let step = 0;
  let buildPhase = true;

  function diagonalStep() {
    const maxStep = GRID_ROWS + GRID_COLS - 2;

    for (let r = 0; r < GRID_ROWS; r++) {
      const c = step - r;
      if (c >= 0 && c < GRID_COLS) {
        const fillTL = (r + c) % 2 === 0;
        const fillBR = (r + c + 1) % 2 === 0; // offset checkerboard

        if (fillTL) gridTL[r][c].style.background = "black";
        if (fillBR) gridBR[GRID_ROWS - 1 - r][GRID_COLS - 1 - c].style.background = "black";
      }
    }

    step++;
    if (step <= maxStep) {
      setTimeout(diagonalStep, DIAGONAL_DELAY);
    } else {
      buildPhase = false;
      reverseFill();
    }
  }

  function reverseFill() {
    let reverseStep = 0;
    const maxStep = Math.floor((GRID_ROWS + GRID_COLS - 2) / 2);

    function fillReverse() {
      // TL: center → top‑left
      for (let r = 0; r < GRID_ROWS; r++) {
        const c = maxStep - reverseStep - r;
        if (c >= 0 && c < GRID_COLS) {
          if ((r + c) % 2 !== 0) gridTL[r][c].style.background = "black";
        }
      }

      for (let r = 0; r < GRID_ROWS; r++) {
        const c = maxStep - reverseStep - r;
        if (c >= 0 && c < GRID_COLS) {
          if ((r + c + 1) % 2 !== 0) gridBR[GRID_ROWS - 1 - r][GRID_COLS - 1 - c].style.background = "black";
        }
      }

      reverseStep++;
      if (reverseStep <= maxStep) {
        setTimeout(fillReverse, DIAGONAL_DELAY);
      } else {
        fadeAndRedirect();
      }
    }
    fillReverse();
  }

  function fadeAndRedirect() {
    overlayTL.classList.add("fade-out");
    overlayBR.classList.add("fade-out");
    setTimeout(() => {
      if (!DEBUG) window.location.href = REDIRECT_URL;
    }, FADE_TIME);
  }

  [overlayTL, overlayBR].forEach(el => {
    el.style.position = "absolute";
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = "translate(-50%, -50%)";
  });

  diagonalStep();
});
