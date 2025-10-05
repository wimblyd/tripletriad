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

    const angle = 60; 
    const diag = Math.sqrt(width * width + height * height) * 1.1;

    [overlayTL, overlayBR].forEach((el) => {
      el.style.position = "absolute";
      el.style.top = "50%";
      el.style.left = "50%";
      el.style.width = `${diag}px`;
      el.style.height = `${diag}px`;
      el.style.transformOrigin = "center";
      el.style.backgroundImage = "repeating-conic-gradient(#000 0% 25%, transparent 25% 50%)";
      el.style.backgroundSize = "64px 64px";
      el.style.opacity = "1";
      el.style.display = "grid";
      el.style.overflow = "visible";
      el.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`; // fixed rotation
    });

    const oldStyle = document.getElementById("dynamic-animations");
    if (oldStyle) oldStyle.remove();

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
