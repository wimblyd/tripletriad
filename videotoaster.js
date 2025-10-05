document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const HOLD_TIME = 0.4;
  const FADE_TIME = 0.6;
  const REDIRECT_URL = "checklist.html";
  const squareSize = 80;

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");
  const container = document.getElementById("computer-container");

  if (!overlayTL || !overlayBR || !container) return;

  function runWipe() {
    const { width, height } = container.getBoundingClientRect();
    const diag = Math.sqrt(width * width + height * height) * 1.2;

    // Calculate offsets
    const angleDeg = 60;
    const angleRad = (angleDeg * Math.PI) / 180;
    const xOffset = diag * Math.cos(angleRad);
    const yOffset = diag * Math.sin(angleRad);

    // Gridmaker
    function setupOverlay(el, invert = false) {
      el.style.position = "absolute";
      el.style.top = "50%";
      el.style.left = "50%";
      el.style.width = `${diag}px`;
      el.style.height = `${diag}px`;
      el.style.transformOrigin = "center";
      el.style.display = "grid";
      el.style.overflow = "visible";
      el.style.opacity = "1";
      el.style.transform = "translate(-50%, -50%)";
      const offset = invert ? squareSize : 0;
      el.style.backgroundImage = `
        repeating-conic-gradient(
          black 0% 25%, 
          transparent 25% 50%
        )
      `;
      el.style.backgroundSize = `${squareSize}px ${squareSize}px`;
      el.style.backgroundPosition = `${offset}px ${offset}px`;
    }

    setupOverlay(overlayTL, false);
    setupOverlay(overlayBR, true);

    // Remove old keyframes
    const oldStyle = document.getElementById("dynamic-animations");
    if (oldStyle) oldStyle.remove();

    // Animate
    const style = document.createElement("style");
    style.id = "dynamic-animations";
    style.textContent = `
      @keyframes slide-in-tl {
        from { transform: translate(calc(-50% - ${xOffset}px), calc(-50% - ${yOffset}px)); }
        to   { transform: translate(-50%, -50%); }
      }
      @keyframes slide-in-br {
        from { transform: translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px)); }
        to   { transform: translate(-50%, -50%); }
      }
    `;
    document.head.appendChild(style);

    overlayTL.style.animation = `slide-in-tl ${SPEED}s ease-out forwards`;
    overlayBR.style.animation = `slide-in-br ${SPEED}s ease-out forwards`;

    // Fade-out and redirect
    let finished = 0;
    function handleFinished() {
      finished++;
      if (finished === 2) {
        setTimeout(() => {
          overlayTL.style.transition = `opacity ${FADE_TIME}s ease-in-out`;
          overlayBR.style.transition = `opacity ${FADE_TIME}s ease-in-out`;
          overlayTL.style.opacity = "0";
          overlayBR.style.opacity = "0";

          setTimeout(() => {
            window.location.href = REDIRECT_URL;
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
