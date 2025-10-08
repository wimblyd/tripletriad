window.addEventListener("load", () => {
  const GRID_COLS = 30;
  const GRID_ROWS = 15;
  const DIAGONAL_DELAY = 40;
  const REDIRECT_URL = "checklist.html";

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");
  const container = document.getElementById("computer-container");

  if (!overlayTL || !overlayBR || !container) return;

  // Do not pass go do not collect $200
  function isMobile() {
    return window.matchMedia("(max-aspect-ratio: 9/16)").matches
        || window.innerWidth < 768;
  }

  if (isMobile()) {
    window.location.replace(REDIRECT_URL);
    return;
  }

  // I wonder what it's like to be the Gridmaker
  const squareSize = Math.ceil(
    Math.max(container.offsetWidth / GRID_COLS, container.offsetHeight / GRID_ROWS)
  );

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

  // Wipe In
  function diagonalStep() {
    const maxStep = GRID_ROWS + GRID_COLS - 2;
    for (let r = 0; r < GRID_ROWS; r++) {
      let cTL = step - r;
      let cBR = step - r;

      if (cTL >= 0 && cTL < GRID_COLS) {
        const fillTL = (r + cTL) % 2 === 0;
        if (fillTL) gridTL[r][cTL].style.background = "black";
      }

      if (cBR >= 0 && cBR < GRID_COLS) {
        const brRow = GRID_ROWS - 1 - r;
        const brCol = GRID_COLS - 1 - cBR;
        const fillBR = (brRow + brCol + 1) % 2 === 0;
        if (fillBR) gridBR[brRow][brCol].style.background = "black";
      }
    }
  // Whahahahahahooha Wipe Out!
    step++;
    if (step <= maxStep) {
      setTimeout(diagonalStep, DIAGONAL_DELAY);
    } else {
      reverseFill();
    }
  }

  function reverseFill() {
    let reverseStep = 0;
    const maxStep = Math.floor((GRID_ROWS + GRID_COLS - 2) / 2);

    function fillReverse() {
      for (let r = 0; r < GRID_ROWS; r++) {
        const c = maxStep - reverseStep - r;
        if (c >= 0 && c < GRID_COLS) {
          if (gridTL[r][c].style.background === "transparent") {
            if ((r + c) % 2 !== 0) gridTL[r][c].style.background = "black";
          }

          const brRow = GRID_ROWS - 1 - r;
          const brCol = GRID_COLS - 1 - c;
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

  // Redirect
  function redirect() {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = 0;
    setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, 500);
  }

  [overlayTL, overlayBR].forEach(el => {
    el.style.position = "absolute";
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = "translate(-50%, -50%)";
    el.style.zIndex = "1";
  });

  const observer = new ResizeObserver(() => {
    observer.disconnect();
    diagonalStep();
  });
  observer.observe(container);
});
