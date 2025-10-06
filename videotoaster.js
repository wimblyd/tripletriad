document.addEventListener("DOMContentLoaded", () => {
  const DEBUG = true; // ← toggle this to false for production

  const SPEED = DEBUG ? 8.0 : 4.0;
  const HOLD_TIME = DEBUG ? 2.0 : 0.4;
  const FADE_TIME = 0.6;
  const REDIRECT_URL = "checklist.html";

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");
  const container = document.getElementById("computer-container");

  if (!overlayTL || !overlayBR || !container) return;

  function buildCheckerboard(el, cols, rows, invert, maskAngleDeg) {
    el.innerHTML = "";
    const rect = container.getBoundingClientRect();
    const squareSize = Math.min(rect.width / cols, rect.height / rows);

    el.style.width = `${cols * squareSize}px`;
    el.style.height = `${rows * squareSize}px`;
    el.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
    el.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;

    // Slope control: tan(60°) = √3
    const slope = Math.tan((maskAngleDeg * Math.PI) / 180);
    const midRow = Math.floor(rows / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = document.createElement("div");

        // Checkerboard
        const filled = (r + c) % 2 === 0;

        // Mask
        const cutoff = midRow - (r - (c / slope));
        const masked = invert ? r - c / slope < midRow - 0.5 : r - c / slope > midRow + 0.5;

        if (!masked && filled) {
          cell.style.background = "black";
        } else {
          cell.style.background = "transparent";
        }

        if (DEBUG) {
          cell.style.outline = "1px solid rgba(255,255,255,0.1)";
        }

        el.appendChild(cell);
      }
    }
  }

  function runWipe() {
    const { width, height } = container.getBoundingClientRect();
    const GRID_COLS = 30;
    const GRID_ROWS = 15;
    const maskAngleDeg = 60;

    buildCheckerboard(overlayTL, GRID_COLS, GRID_ROWS, false, maskAngleDeg);
    buildCheckerboard(overlayBR, GRID_COLS, GRID_ROWS, true, maskAngleDeg);

    // Offsets
    const diagAngle = (maskAngleDeg * Math.PI) / 180;
    const diagLength = Math.sqrt(width ** 2 + height ** 2);
    const offsetX = Math.cos(diagAngle) * diagLength * 0.5;
    const offsetY = Math.sin(diagAngle) * diagLength * 0.5;

    // Wipe old keyframes
    const old = document.getElementById("dynamic-animations");
    if (old) old.remove();

    // Dynamic keyframes
    const style = document.createElement("style");
    style.id = "dynamic-animations";
    style.textContent = `
      @keyframes slide-in-tl {
        from { transform: translate(calc(-50% - ${offsetX}px), calc(-50% + ${offsetY}px)); }
        to   { transform: translate(-50%, -50%); }
      }
      @keyframes slide-in-br {
        from { transform: translate(calc(-50% + ${offsetX}px), calc(-50% - ${offsetY}px)); }
        to   { transform: translate(-50%, -50%); }
      }
    `;
    document.head.appendChild(style);

    overlayTL.style.animation = `slide-in-tl ${SPEED}s ease-out forwards`;
    overlayBR.style.animation = `slide-in-br ${SPEED}s ease-out forwards`;

    // Redirect
    let finished = 0;
    function handleFinished() {
      finished++;
      if (finished === 2) {
        setTimeout(() => {
          overlayTL.classList.add("fade-out");
          overlayBR.classList.add("fade-out");
          setTimeout(() => {
            if (!DEBUG) window.location.href = REDIRECT_URL;
          }, FADE_TIME * 1000);
        }, HOLD_TIME * 1000);
      }
    }

    overlayTL.addEventListener("animationend", handleFinished, { once: true });
    overlayBR.addEventListener("animationend", handleFinished, { once: true });
  }

  window.addEventListener("load", runWipe);
  window.addEventListener("resize", runWipe);
});
