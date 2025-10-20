// Tooltip
const tooltip = document.createElement("div");
Object.assign(tooltip.style, {
  position: "fixed",
  background: "#e8e8e8",
  color: "black",
  border: "1px solid #808080",
  borderTopColor: "#ffffff",
  borderLeftColor: "#ffffff",
  padding: "2px 6px",
  fontSize: "11px",
  fontFamily: "Tahoma, sans-serif",
  boxShadow: "2px 2px 0 #00000033",
  borderRadius: "2px",
  pointerEvents: "none",
  transition: "opacity 0.15s ease",
  opacity: "0",
  zIndex: "9999",
});
document.body.appendChild(tooltip);

document.querySelectorAll("#start .sys-btn, #start .sys-btn2").forEach(btn => {
  const text = btn.dataset.tooltip;
  if (!text) return;

  btn.addEventListener("mouseenter", e => {
    tooltip.textContent = text;
    tooltip.style.opacity = "1";
    tooltip.style.left = `${e.clientX + 10}px`;
    tooltip.style.top = `${Math.max(0, e.clientY - 30)}px`;
  });

  btn.addEventListener("mousemove", e => {
    tooltip.style.left = `${e.clientX + 10}px`;
    tooltip.style.top = `${Math.max(0, e.clientY - 30)}px`;
  });

  btn.addEventListener("mouseleave", () => {
    tooltip.style.opacity = "0";
  });
});

document.addEventListener("DOMContentLoaded", () => {

  // Animation Helpers
  function animateMinimize(el, onEnd) {
    if (!el) return;
    const className = el.id === "helpMenu" ? "minimizingMenu" : "minimizingWindow";
    el.classList.remove("restoringMenu", "restoringWindow");
    el.classList.add(className);
    el.addEventListener("animationend", function handler() {
      el.classList.remove(className);
      el.style.display = "none";
      el.removeEventListener("animationend", handler);
      if (onEnd) onEnd();
    });
  }

  function animateRestore(el) {
    if (!el) return;
    const className = el.id === "helpMenu" ? "restoringMenu" : "restoringWindow";
    el.style.display = "block";
    el.classList.remove("minimizingMenu", "minimizingWindow");
    el.classList.add(className);
    el.addEventListener("animationend", function handler() {
      el.classList.remove(className);
      el.removeEventListener("animationend", handler);
    });
  }

  // Help Menu
  const startBtn = document.getElementById("startBtn");
  if (!startBtn) return;

  const helpMenu = document.createElement("div");
  helpMenu.id = "helpMenu";
  Object.assign(helpMenu.style, {
    position: "fixed",
    bottom: "28px",
    left: "0px",
    width: "255px",
    backgroundColor: "#c0c0c0",
    border: "2px solid #000",
    padding: "4px 0",
    fontFamily: "Tahoma, sans-serif",
    fontSize: "10px",
    display: "none",
    zIndex: "9999",
    boxShadow: "2px 2px 0 #808080 inset, -1px -1px 0 #fff inset",
  });

  const helpItems = [
    { icon: "img/icon-about.png", text: "How to Use This Checklist:" },
    { icon: "img/icon-click.png", text: "Click Cards to Flip 🢒" },
    { icon: "img/icon-unflip.png", text: "Click Again to Unflip" },
    { icon: "img/Boost.png", text: "Locks Cards for Counting 🢒" },
    { icon: "img/BoostUsed.png", text: "Press to Unlock a Card 🢒" },
    { icon: "img/PopOut.png", text: "Pops Out Cards in New Window" },
    { icon: "img/Close.png", text: "Close Pop Out to Restore" },
    { icon: "img/icon-save.png", text: "Autosaves to localStorage" },
    { icon: "img/ChocoboWorld.png", text: "Launch Chocobo World" },
    { icon: "img/icon-keys.png", text: "Chocobo World Requires a Keyboard 🢒" },
    { icon: "img/icon-screensaver.png", text: "Launch Screensaver" }
  ];

  const submenuData = {
    "Flip": [
      "Click a card once to flip it",
      "Adds Log Entry for Card Acquisition"
    ],
    "Locks": [
      "Press the Boost Button",
      "Opens the Card Counter",
      "Use the Arrows to Track Card Count"
    ],
    "Unlock": [
      "Closes Card Counter",
      "Clears Card Count",
      "Allows Card to Flip Back"
    ],
    "Boko": [
      "Use Arrow Keys to Move",
      "Space to Jump",
      "R & E for Choco World Events",
      "Disclaimer: This is not a real game",
      "You cannot connect this to any version of FFVIII"
    ]
  };

  helpItems.forEach(item => {
    const line = document.createElement("div");
    line.textContent = item.text;

    Object.assign(line.style, {
      display: "flex",
      alignItems: "center",
      backgroundColor: "#c0c0c0",
      padding: "2px 6px 2px 48px",
      margin: "0",
      height: "40px",
      lineHeight: "12px",
      fontSize: "10px",
      backgroundImage: `url(${item.icon})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "40px 37px",
      backgroundPosition: "4px center",
      borderTop: "1px solid #fff",
      borderLeft: "1px solid #fff",
      borderBottom: "1px solid #808080",
      borderRight: "1px solid #808080",
      color: "#000",
      position: "relative"
    });

    line.addEventListener("mouseenter", () => {
      line.style.backgroundColor = "#000080";
      line.style.color = "#fff";
    });
    line.addEventListener("mouseleave", () => {
      line.style.backgroundColor = "#c0c0c0";
      line.style.color = "#000";
    });

    // Submenu
    const matchedKey = Object.keys(submenuData).find(key =>
      item.text.includes(key)
    );

    if (matchedKey) {
      const submenu = document.createElement("div");
      Object.assign(submenu.style, {
        position: "absolute",
        top: "0",
        left: "255px",
        backgroundColor: "#c0c0c0",
        border: "2px solid #000",
        boxShadow: "2px 2px 0 #808080 inset, -1px -1px 0 #fff inset",
        display: "none",
        zIndex: "10000",
        minWidth: "180px",
        fontSize: "10px"
      });

      submenuData[matchedKey].forEach(subtext => {
        const subItem = document.createElement("div");
        subItem.textContent = subtext;
        Object.assign(subItem.style, {
          padding: "4px 8px",
          borderTop: "1px solid #fff",
          borderLeft: "1px solid #fff",
          borderBottom: "1px solid #808080",
          borderRight: "1px solid #808080",
        });
        subItem.addEventListener("mouseenter", () => {
          subItem.style.backgroundColor = "#000080";
          subItem.style.color = "#fff";
        });
        subItem.addEventListener("mouseleave", () => {
          subItem.style.backgroundColor = "#c0c0c0";
          subItem.style.color = "#000";
        });
        submenu.appendChild(subItem);
      });

      line.addEventListener("mouseenter", () => {
        submenu.style.display = "block";
      });
      line.addEventListener("mouseleave", () => {
        setTimeout(() => {
          if (!submenu.matches(":hover")) submenu.style.display = "none";
        }, 100);
      });
      submenu.addEventListener("mouseleave", () => {
        submenu.style.display = "none";
      });

      line.appendChild(submenu);
    }

    // Clickable items
    if (item.text.includes("Pops Out") || item.text.includes("Chocobo") || item.text.includes("Close") ||
        item.text.includes("Screensaver") || item.text.includes("Autosaves") || item.text.includes("Unflip")) {
      line.addEventListener("click", () => {
        if (item.text.includes("Pops Out")) {
          const originalPopOutBtn = document.getElementById("popOutBtn");
          if (originalPopOutBtn) originalPopOutBtn.click();
        }
        if (item.text.includes("Chocobo")) {
          const overlay = document.getElementById("boko-overlay");
          if (overlay) {
            const wrapper = document.getElementById("boko-wrapper");
            overlay.style.display = "block";
            animateRestore(wrapper);
          }
        }
        if (item.text.includes("Close")) {
          if (window.popOutWin && !window.popOutWin.closed) {
            window.popOutWin.close();
            window.popOutWin = null;
          }
        }
        if (item.text.includes("Screensaver")) {
          const strsBtn = document.getElementById("starsButton");
          if (strsBtn) strsBtn.click();
        }
        if (item.text.includes("Autosaves")) {
          addLogEntry("GAME FOLDER IN USE: localStorage [Clear Cookies] to Overwrite");
        }
        if (item.text.includes("Unflip")) {
          const resetBtn = document.getElementById("resetButton");
          if (resetBtn) resetBtn.click();
        }
      });
    }

    helpMenu.appendChild(line);
  });

  document.body.appendChild(helpMenu);

  startBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (helpMenu.style.display === "none" || helpMenu.style.display === "") {
      animateRestore(helpMenu);
    } else {
      animateMinimize(helpMenu);
    }
  });

  document.addEventListener("click", e => {
    if (!helpMenu.contains(e.target) && e.target !== startBtn && helpMenu.style.display === "block") {
      animateMinimize(helpMenu);
    }
  });

  // Chocobo World
  const overlay = document.getElementById("boko-overlay");
  const iframe = document.querySelector("#boko-wrapper iframe");
  const closeHotspot = document.getElementById("boko-close-hotspot");

  function showBokoOverlay() {
    overlay.style.display = "block";
    const wrapper = document.getElementById("boko-wrapper");
    animateRestore(wrapper);
    overlay.setAttribute("tabindex", "-1");
    overlay.focus();
    iframe.addEventListener("load", () => {
      iframe.contentWindow.focus();
    }, { once: true });
    setTimeout(() => {
      iframe.contentWindow.focus();
    }, 150);
  }

  function hideBokoOverlay() {
    const wrapper = document.getElementById("boko-wrapper");
    animateMinimize(wrapper, () => {
      overlay.style.display = "none";
      const cwBtn = document.getElementById("cwBtn");
      if (cwBtn) cwBtn.focus();
    });
  }

  if (closeHotspot) closeHotspot.addEventListener("click", hideBokoOverlay);
  const cwBtn = document.getElementById("cwBtn");
  if (cwBtn) cwBtn.addEventListener("click", showBokoOverlay);
});
