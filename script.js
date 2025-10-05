document.addEventListener("DOMContentLoaded", () => {
  const SPEED = 5.0;       // wipe animation duration
  const HOLD_TIME = 0.4;   // hold before fade
  const FADE_TIME = 0.6;   // fade duration
  const REDIRECT_URL = "checklist.html";

  const overlayTL = document.getElementById("overlay-tl");
  const overlayBR = document.getElementById("overlay-br");
  const screen = document.getElementById("computer-container");

  if (!overlayTL || !overlayBR || !screen) return;

  function runWipe() {
    const { width, height } = screen.getBoundingClientRect();
    const angle = Math.atan(height / width) * (180 / Math.PI);
    const travelX = width * Math.SQRT2;  // distance for diagonal motion
    const travelY = height * Math.SQRT2;

    // Grid
    [overlayTL, overlayBR].forEach(el => {
      el.style.position = "absolute";
      el.style.top = "50%";
      el.style.left = "50%";
      el.style.width = "200%";
      el.style.height = "200%";
      el.style.transformOrigin = "center";
      el.style.backgroundImage = "repeating-conic-gradient(#000 0% 25%, transparent 25% 50%)";
      el.style.backgroundSize = "64px 64px";
      el.style.opacity = "1";
    });

    // Inject keyframes dynamically
    const oldStyle = document.getElementById("dynamic-animations");
    if (oldStyle) oldStyle.remove();

    const style = document.createElement("style");
    style.id = "dynamic-animations";
    style.textContent = `
      @keyframes slide-in-tl {
        from { transform: translate(-50%, -50%) rotate(${angle}deg) translate(-100%, -100%); }
        to   { transform: translate(-50%, -50%) rotate(${angle}deg) translate(0,0); }
      }
      @keyframes slide-in-br {
        from { transform: translate(-50%, -50%) rotate(${angle}deg) translate(100%, 100%); }
        to   { transform: translate(-50%, -50%) rotate(${angle}deg) translate(0,0); }
      }
    `;
    document.head.appendChild(style);

    // Rotation
    overlayTL.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    overlayBR.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    // Animation
    overlayTL.style.animation = `slide-in-tl ${SPEED}s ease-out forwards`;
    overlayBR.style.animation = `slide-in-br ${SPEED}s ease-out forwards`;

    // Redirect
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
