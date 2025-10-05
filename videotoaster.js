document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;
  const HOLD_TIME = 0.4;
  const FADE_TIME = 0.6;
  const REDIRECT_URL = "checklist.html";

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");
  const container = document.getElementById("computer-container");

  if (!overlayTL || !overlayBR || !container) return;

  function runWipe() {
    const { width, height } = container.getBoundingClientRect();

    const angle = 60; // rotation of checkerboard blocks
    const diag = Math.sqrt(width * width + height * height) * 1.1;

    const squareSize = 80; 

    // Top-left overlay
    overlayTL.style.position = "absolute";
    overlayTL.style.top = "50%";
    overlayTL.style.left = "50%";
    overlayTL.style.width = `${diag}px`;
    overlayTL.style.height = `${diag}px`;
    overlayTL.style.transformOrigin = "center";
    overlayTL.style.backgroundImage = "repeating-conic-gradient(#000 0% 25%, transparent 25% 50%)";
    overlayTL.style.backgroundSize = `${squareSize}px ${squareSize}px`;
    overlayTL.style.backgroundPosition = `0 0`;
    overlayTL.style.opacity = "1";
    overlayTL.style.display = "grid";
    overlayTL.style.overflow = "visible";
    overlayTL.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    // Bottom-right overlay
    overlayBR.style.position = "absolute";
    overlayBR.style.top = "50%";
    overlayBR.style.left = "50%";
    overlayBR.style.width = `${diag}px`;
    overlayBR.style.height = `${diag}px`;
    overlayBR.style.transformOrigin = "center";
    overlayBR.style.backgroundImage = "repeating-conic-gradient(#000 0% 25%, transparent 25% 50%)";
    overlayBR.style.backgroundSize = `${squareSize}px ${squareSize}px`;
    overlayBR.style.backgroundPosition = `${squareSize}px ${squareSize}px`; // offset one square
    overlayBR.style.opacity = "1";
    overlayBR.style.display = "grid";
    overlayBR.style.overflow = "visible";
    overlayBR.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    // Remove old keyframes
    const oldStyle = document.getElementById("dynamic-animations");
    if (oldStyle) oldStyle.remove();

    // Animate
    const style = document.createElement("style");
    style.id = "dynamic-animations";
    style.textContent = `
      @keyframes slide-in-tl {
        from { transform: translate(calc(-50% - ${diag}px), calc(-50% - ${diag}px)) rotate(${angle}deg); }
        to   { transform: translate(-50%, -50%) rotate(${angle}deg); }
      }
      @keyframes slide-in-br {
        from { transform: translate(calc(-50% + ${diag}px), calc(-50% + ${diag}px)) rotate(${angle}deg); }
        to   { transform: translate(-50%, -50%) rotate(${angle}deg); }
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
