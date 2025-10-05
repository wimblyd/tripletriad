document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const squareSize = 60;
  const bufferTiles = 4; // how many extra tiles outside the viewport (tweak if needed)

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");

  function snapUp(px) {
    return Math.ceil(px / squareSize) * squareSize;
  }

  function build() {
    // clear any previous tiles
    overlayTL.innerHTML = "";
    overlayBR.innerHTML = "";

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const diagonal = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
    const extraDist = diagonal / 2;

    // total area to cover = visible diagonal + how far it travels
    const totalCoverage = diagonal + extraDist;

    const cols = Math.ceil(totalCoverage / squareSize) + bufferTiles;
    const rows = Math.ceil(totalCoverage / squareSize) + bufferTiles;

    const originOffset = bufferTiles * squareSize;

    // Snap animation distances to whole tiles to preserve alignment
    const snappedStart = snapUp(screenWidth);
    const snappedEnd = snapUp(extraDist);

    // Common container sizing/origin so both grids share the same tile coordinates
    [overlayTL, overlayBR].forEach((el) => {
      el.style.position = "absolute";
      el.style.top = `-${originOffset}px`;
      el.style.left = `-${originOffset}px`;
      el.style.width = `${cols * squareSize}px`;
      el.style.height = `${rows * squareSize}px`;
      el.style.display = "grid";
      el.style.gridTemplateColumns = `repeat(${cols}, ${squareSize}px)`;
      el.style.gridTemplateRows = `repeat(${rows}, ${squareSize}px)`;
      el.style.pointerEvents = "none";
      el.style.overflow = "hidden";
      // expose the snapped distances to CSS animation via vars
      el.style.setProperty("--start-dist", `${snappedStart}px`);
      el.style.setProperty("--end-dist", `${snappedEnd}px`);
    });

    // Build tiles: keep the original diagonal "wedge" logic
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // TL overlay wedge (original logic)
        const squareTL = document.createElement("div");
        const parityTL = (r + c) % 2 === 0;
        const isBlackTL = (c < cols - r) && parityTL;
        squareTL.style.width = `${squareSize}px`;
        squareTL.style.height = `${squareSize}px`;
        squareTL.style.background = isBlackTL ? "black" : "transparent";
        overlayTL.appendChild(squareTL);

        // BR overlay wedge (inverted/or shifted to line up)
        const squareBR = document.createElement("div");
        // replicate the earlier invert logic (keeps wedge & lines up parity)
        const isBlackBR = (c >= cols - r - 1) && ((r + c + 1) % 2 === 0);
        squareBR.style.width = `${squareSize}px`;
        squareBR.style.height = `${squareSize}px`;
        squareBR.style.background = isBlackBR ? "black" : "transparent";
        overlayBR.appendChild(squareBR);
      }
    }

    // restart animations so they use the newest CSS vars
    overlayTL.style.animation = "none";
    overlayBR.style.animation = "none";
    // force reflow to reset animations
    void overlayTL.offsetWidth;
    void overlayBR.offsetWidth;
    overlayTL.style.animation = `slide-in-tl ${SPEED}s forwards ease-out`;
    overlayBR.style.animation = `slide-in-br ${SPEED}s forwards ease-out`;
  }

  build();

  // debounce rebuild on resize/orientation change
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 120);
  });

  // keep redirect behavior (wait for both animations)
  let animationsFinished = 0;
  function checkRedirect() {
    animationsFinished++;
    if (animationsFinished === 2) {
      window.location.href = "checklist.html";
    }
  }
  overlayTL.addEventListener("animationend", checkRedirect, { once: true });
  overlayBR.addEventListener("animationend", checkRedirect, { once: true });
});
