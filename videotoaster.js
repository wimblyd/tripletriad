document.addEventListener("DOMContentLoaded", () => {
  const GRID_COLS = 30;
  const GRID_ROWS = 15;
  const DIAGONAL_DELAY = 40;
  const REDIRECT_URL = "checklist.html";

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");
  const container = document.getElementById("computer-container");

  if (!overlayTL || !overlayBR || !container) return;

  const squareSize = Math.max(container.offsetWidth / GRID_COLS, container.offsetHeight / GRID_ROWS);

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

  let step = 0;

  // Fill the Checkerboard
  function diagonalStep() {
    const maxStep = GRID_ROWS + GRID_COLS - 2;

    for (let r = 0; r < GRID_ROWS; r++) {
      let cTL = step - r;
      let cBR = step - r;

      // TL grid fill
      if (cTL >= 0 && cTL < GRID_COLS) {
        const fillTL = (r + cTL) % 2 === 0;
        if (fillTL) gridTL[r][cTL].style.background = "black";
      }

      // BR grid fill
      if (cBR >= 0 && cBR < GRID_COLS) {
        const brRow = GRID_ROWS - 1 - r;
        const brCol = GRID_COLS - 1 - cBR;
        const fillBR = (brRow + brCol + 1) % 2 === 0;
        if (fillBR) gridBR[brRow][brCol].style.background = "black";
      }
    }
    
    // Wipe In
    step++;
    if (step <= maxStep) {
      setTimeout(diagonalStep, DIAGONAL_DELAY);
    } else {
      reverseFill();
    }
  }
  
  // Whooohahahahahaooo Wipeout!
  function reverseFill() {
    let reverseStep = 0;
    const maxStep = Math.floor((GRID_ROWS + GRID_COLS - 2) / 2);

    function fillReverse() {
      for (let r = 0; r < GRID_ROWS; r++) {
        const c = maxStep - reverseStep - r;

        // TL reverse fill
        if (c >= 0 && c < GRID_COLS) {
          if (gridTL[r][c].style.background === "transparent") {
            if ((r + c) % 2 !== 0) gridTL[r][c].style.background = "black";
          }
        }

        // BR reverse fill
        const brRow = GRID_ROWS - 1 - r;
        const brCol = GRID_COLS - 1 - c;
        if (c >= 0 && c < GRID_COLS) {
          if (gridBR[brRow][brCol].style.background === "transparent") {
            if ((brRow + brCol + 1) % 2 !== 0) gridBR[brRow][brCol].style.background = "black";
          }
        }
      }

      reverseStep++;
      if (reverseStep <= maxStep) {
        setTimeout(fillReverse, DIAGONAL_DELAY);
      } else {
        redirect();
      }
    }
    fillReverse();
  }

  // Do not pass go do not collect $200
  function redirect() {
    window.location.href = REDIRECT_URL;
  }

  [overlayTL, overlayBR].forEach(el => {
    el.style.position = "absolute";
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = "translate(-50%, -50%)";
    el.style.zIndex = "1";
  });

  diagonalStep();
});
