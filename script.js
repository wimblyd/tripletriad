document.addEventListener("DOMContentLoaded", () => {
  const logDiv = document.getElementById('operation-log');

 // Mobile-only Log Dropdown
  const logToggleBar = document.getElementById('logToggleBar');
if (logToggleBar) {
  const logDiv = document.getElementById('operation-log');

  // Start hidden on mobile
  if (window.innerWidth <= 480) logDiv.classList.add('mobile-hidden');

  logToggleBar.addEventListener('click', () => {
    const isHidden = logDiv.classList.toggle('mobile-hidden');
  });
}

  // Come on and get your Log!
  (JSON.parse(localStorage.getItem("operationLog") || "[]")).forEach(entryObj => {
    const div = document.createElement('div');
    if (typeof entryObj === "string") {
      div.textContent = entryObj;
    } else {
      div.textContent = entryObj.message;
      div.style.color = entryObj.color;
    }
    logDiv.appendChild(div);
  });

  logDiv.scrollTop = logDiv.scrollHeight;

  // Labelmaker
  document.querySelectorAll('.card').forEach(card => {
    const label = document.createElement('div');
    label.className = 'card-label';
    label.textContent = card.title || card.querySelector('.card-front')?.alt || '';
    card.insertAdjacentElement('afterend', label);
  });

  const cards = document.querySelectorAll('.card');

  // Out of Sync
  cards.forEach(card => {
    const state = localStorage.getItem(card.dataset.cardId);
    if (state === "flipped") {
      card.classList.add("flipped");
      card.setAttribute("aria-pressed", "true");
      if (localStorage.getItem(`${card.dataset.cardId}-boost`) === "used") {
        card.classList.add("boost-locked");
      }
    } else {
      card.classList.remove("flipped");
      card.setAttribute("aria-pressed", "false");
    }
  const boostKey = `${card.dataset.cardId}-boost`;
  const boostUsed = localStorage.getItem(boostKey) === "used";
  const boost = card.querySelector(".boost-button");

  if (boost) {
    if (boostUsed) {
      boost.classList.add("used");
      boost.src = "img/BoostUsed.png"; 
      card.classList.add("boost-locked");
    } else {
      boost.classList.remove("used");
      boost.src = "img/Boost.png";
      card.classList.remove("boost-locked");
    }
  }
});

  // Flipadelphia
  const toggleFlip = (card, id) => {
    const boostUsed = localStorage.getItem(`${id}-boost`) === "used";
    if (boostUsed && card.classList.contains("flipped")) return;

    card.classList.toggle("flipped");

    if (boostUsed) {
      card.classList.add("boost-locked");
    } else {
      card.classList.remove("boost-locked");
    }

    const state = card.classList.contains("flipped") ? "flipped" : "unflipped";
    saveCardState(id, state);
    card.setAttribute("aria-pressed", card.classList.contains("flipped") ? "true" : "false");

    if (card.classList.contains("flipped")) {
      addLogEntry(`Acquired ${card.title}`);
    } else {
      const counterNumberContainer = card.querySelector(".counter-number-container");
      if (counterNumberContainer) {
        const idNumber = card.dataset.cardId.replace("card-", "");
        localStorage.setItem(`card-${idNumber}-count`, 0);
        counterNumberContainer.innerHTML = "";
        const digitImg = Object.assign(document.createElement("img"), {
          src: `img/0.png`,
          alt: "0",
          className: "counter-number"
        });
        counterNumberContainer.appendChild(digitImg);
      }
      addLogEntry(`Lost ${card.title}`);
    }
  };

  cards.forEach(card => {
    card.addEventListener("click", () => {
      toggleFlip(card, card.dataset.cardId);
    });
  });

  // Unflipadelphia
  document.getElementById("resetButton")?.addEventListener("click", () => {
    cards.forEach(card => {
      card.classList.remove("flipped");
      saveCardState(card.dataset.cardId, "unflipped");
      card.setAttribute("aria-pressed", "false");

      const counter = card.querySelector(".card-counter");
      if (counter) {
        const id = counter.dataset.cardId;
        localStorage.setItem(`card-${id}-count`, 0);
        const numberContainer = counter.querySelector(".counter-number-container");
        if (numberContainer) {
          numberContainer.innerHTML = "";
          const zeroImg = Object.assign(document.createElement("img"), {
            src: "img/0.png",
            alt: "0",
            className: "counter-number"
          });
          numberContainer.appendChild(zeroImg);
        }
        counter.classList.remove("visible");
      }

      const boost = card.querySelector(".boost-button");
      if (boost) {
        boost.classList.remove("used");
        boost.src = "img/Boost.png";
        localStorage.removeItem(`${card.dataset.cardId}-boost`);
      }
      card.classList.remove("boost-locked");
    });

    addLogEntry("Cards unflipped");
  });

  // Everything but the Kitchen Sync
window.addEventListener("storage", event => {
  if (!event.key) return;

  // Flip sync
  if (event.key.startsWith("card-") && !event.key.endsWith("-count") && !event.key.endsWith("-boost")) {
    const card = document.querySelector(`[data-card-id="${event.key}"]`);
    if (card) {
      const shouldBeFlipped = event.newValue === "flipped";
      card.classList.toggle("flipped", shouldBeFlipped);
      card.setAttribute("aria-pressed", shouldBeFlipped ? "true" : "false");
      if (shouldBeFlipped && localStorage.getItem(`${event.key}-boost`) === "used") {
        card.classList.add("boost-locked");
      } else {
        card.classList.remove("boost-locked");
      }
    }
  }

  // Count sync
  if (event.key.endsWith("-count")) {
    const id = event.key.replace("card-", "").replace("-count", "");
    const counter = document.querySelector(`.card-counter[data-card-id="${id}"]`);
    if (counter) {
      const numberContainer = counter.querySelector(".counter-number-container");
      const newCount = parseInt(event.newValue, 10) || 0;
      numberContainer.innerHTML = "";
      if (newCount >= 100) {
        const star = Object.assign(document.createElement("img"), { src: "img/Star.png", alt: "100", className: "counter-number" });
        numberContainer.appendChild(star);
      } else {
        newCount.toString().split("").forEach(d => {
          const digitImg = Object.assign(document.createElement("img"), { src: `img/${d}.png`, alt: d, className: "counter-number" });
          numberContainer.appendChild(digitImg);
        });
      }
      if (newCount > 0) counter.classList.add("visible");
      else counter.classList.remove("visible");
    }
  }

  // Boost sync
  if (event.key.endsWith("-boost")) {
    const id = event.key.replace("card-", "").replace("-boost", "");
    const card = document.querySelector(`.card[data-card-id="card-${id}"]`);
    const boost = card?.querySelector(".boost-button");
    const counter = card?.querySelector(".card-counter");
    const numberContainer = counter?.querySelector(".counter-number-container");

    if (card && boost && counter && numberContainer) {
      if (event.newValue === "used") {
        boost.classList.add("used");
        if (card.classList.contains("flipped")) card.classList.add("boost-locked");

        localStorage.setItem(`card-${id}-count`, 1);
        numberContainer.innerHTML = "";
        const digitImg = Object.assign(document.createElement("img"), {
          src: "img/1.png",
          alt: "1",
          className: "counter-number"
        });
        numberContainer.appendChild(digitImg);
        counter.classList.add("visible");
        addLogEntry(`${card.title} count changed to 1`);
      } else {
        boost.classList.remove("used");
        card.classList.remove("boost-locked");

        localStorage.setItem(`card-${id}-count`, 0);
        numberContainer.innerHTML = "";
        const zeroImg = Object.assign(document.createElement("img"), {
          src: "img/0.png",
          alt: "0",
          className: "counter-number"
        });
        numberContainer.appendChild(zeroImg);
        counter.classList.remove("visible");
        addLogEntry(`${card.title} count cleared`);
      }
    }
  }
});

// Copy Log - Clear Log - Guide 
document.getElementById("copyLogButton")?.addEventListener("click", () => {
  const logDiv = document.getElementById('operation-log');
  const text = Array.from(logDiv.children).map(div => div.textContent).join("\n");
  navigator.clipboard.writeText(text)
    .then(() => addLogEntry("Log copied to clipboard"))
    .catch(err => console.error("Failed to copy log:", err));
});

document.getElementById("clearLogButton")?.addEventListener("click", () => {
  const logDiv = document.getElementById('operation-log');
  logDiv.innerHTML = "";
  const now = new Date();
  const timestamp = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()} | ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
  const entry = `[${timestamp}] Log cleared`;
  localStorage.setItem("operationLog", JSON.stringify([entry]));
  logDiv.appendChild(Object.assign(document.createElement("div"), { textContent: entry }));
  logDiv.scrollTop = logDiv.scrollHeight;
});

document.getElementById("guideButton")?.addEventListener("click", () => {
  window.open("https://www.dropbox.com/scl/fi/wzkqfhaz78xm8aazuwyoe/Wimbly-Donner-s-Guide-to-Triple-Triad-v.03.2.pdf?rlkey=v5blv7r5kodab77ksk71ll0sx&e=1&st=srlyik69&dl=0", "_blank");
  addLogEntry("Guide Downloaded");
});

  // Mathemathical!
 (function addCardCounters() {
  const counterCardIds = [...Array(47).keys()].map(i => i + 1)
    .concat([...Array(29).keys()].map(i => i + 49));

  counterCardIds.forEach(id => {
    const card = document.querySelector(`.card[data-card-id="card-${id}"]`);
    if (!card) return;

    const cardInner = card.querySelector(".card-inner");

    // Create counter
    const counter = document.createElement("div");
    counter.className = "card-counter";
    counter.dataset.cardId = id;

    const upArrow = Object.assign(document.createElement("img"), { className: "counter-arrow up", src: "img/UpArrow.png", alt: "+1" });
    const downArrow = Object.assign(document.createElement("img"), { className: "counter-arrow down", src: "img/DownArrow.png", alt: "-1" });
    const numberContainer = document.createElement("div");
    numberContainer.className = "counter-number-container";

    counter.append(upArrow, numberContainer, downArrow);

    const boost = Object.assign(document.createElement("img"), { className: "boost-button", src: "img/Boost.png", alt: "Show counter" });
    cardInner.append(boost, counter);

    let count = parseInt(localStorage.getItem(`card-${id}-count`), 10);
    if (isNaN(count)) count = 0;

    const renderNumber = c => {
      numberContainer.innerHTML = "";
      if (c >= 100) {
        const star = Object.assign(document.createElement("img"), { src: "img/Star.png", alt: "100", className: "counter-number" });
        numberContainer.appendChild(star);
      } else {
        c.toString().split("").forEach(d => {
          const digitImg = Object.assign(document.createElement("img"), { src: `img/${d}.png`, alt: d, className: "counter-number" });
          numberContainer.appendChild(digitImg);
        });
      }
      if (c > 0) counter.classList.add("visible");
      else counter.classList.remove("visible");
    };

    renderNumber(count);

    // Restore boost state if it was used
const boostKey = `card-${id}-boost`;
const boostUsed = localStorage.getItem(boostKey) === "used";

if (boostUsed) {
  boost.classList.add("used");
  boost.src = "img/BoostUsed.png";
  card.classList.add("boost-locked");

  if (!count || count === 0) {
    count = 1;
    localStorage.setItem(`card-${id}-count`, count);
    renderNumber(count);
  }
  counter.classList.add("visible");
}

    const updateCount = delta => {
      count = Math.max(0, Math.min(100, count + delta));
      localStorage.setItem(`card-${id}-count`, count); // <-- Cross-tab sync happens here
      renderNumber(count);
      addLogEntry(`${card.title} count changed to ${count}`);
    };

    upArrow.addEventListener("click", e => { e.stopPropagation(); updateCount(1); });
    downArrow.addEventListener("click", e => { e.stopPropagation(); updateCount(-1); });

    boost.addEventListener("click", e => {
      e.stopPropagation();
      const boostKey = `card-${id}-boost`;
      const boostUsed = localStorage.getItem(boostKey) === "used";

      if (!boostUsed) {
        count = 1;
        localStorage.setItem(`card-${id}-count`, count); // <-- Cross-tab sync
        renderNumber(count);
        counter.classList.add("visible");
        boost.classList.add("used");
        localStorage.setItem(boostKey, "used");

        if (card.classList.contains("flipped")) card.classList.add("boost-locked");

        addLogEntry(`${card.title} count changed to ${count}`);
      } else {
        count = 0;
        localStorage.setItem(`card-${id}-count`, count); // <-- Cross-tab sync
        renderNumber(count);
        counter.classList.remove("visible");
        boost.classList.remove("used");
        localStorage.removeItem(boostKey);

        card.classList.remove("boost-locked");

        addLogEntry(`${card.title} count cleared`);
      }
    });
  });
})();
  
  // Clock
  function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sys-clock').textContent = timeString;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Toaster
const popOutButton = document.getElementById("popOutBtn");
let popOutWin = null;

popOutButton.addEventListener("click", () => {
  const screenDiv = document.querySelector(".screen");
  if (!screenDiv) return;

  // Focus
  if (popOutWin && !popOutWin.closed) {
    popOutWin.focus();
    return;
  }

  // Sizer
  const rect = screenDiv.getBoundingClientRect();
  const paddingWidth = 20;   // buffer for window chrome
  const paddingHeight = 40;

  const minWidth = window.innerWidth * 0.85;   // 85% viewport for mobile
  const minHeight = window.innerHeight * 0.85;

  const winWidth = Math.max(rect.width + paddingWidth, minWidth);
  const winHeight = Math.max(rect.height + paddingHeight, minHeight);

  const features = `width=${Math.ceil(winWidth)},height=${Math.ceil(winHeight)},scrollbars=no,resizable=yes`;
  popOutWin = window.open("", "_blank", features);

  // Inline Styles
  const styles = [...document.querySelectorAll("link[rel='stylesheet'], style")];
  styles.forEach(s => popOutWin.document.head.appendChild(s.cloneNode(true)));

  // Pop Out Styles
  const style = document.createElement("style");
  style.textContent = `
    html, body.popout-mode {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      background: black;
      overflow: hidden;
    }

    .popout-mode .screen {
      display: inline-flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      width: auto;
      max-width: 100%;
      padding: 2px;
      gap: 8px;
      box-sizing: border-box;
      overflow: auto;
      margin: 10px; 
    }
  `;
  popOutWin.document.head.appendChild(style);

  // Pop
  popOutWin.document.body.classList.add("popout-mode");
  popOutWin.document.body.appendChild(screenDiv);

  // Restore Refresh
  popOutWin.addEventListener("beforeunload", () => {
    document.querySelector(".wrapper").appendChild(screenDiv);
    location.reload(); // fixes layout when popping back
  });

  // Resize
  function resizePopout() {
    const screenRect = screenDiv.getBoundingClientRect();
    const newWidth = Math.max(screenRect.width + paddingWidth, minWidth);
    const newHeight = Math.max(screenRect.height + paddingHeight, minHeight);
    popOutWin.resizeTo(Math.ceil(newWidth), Math.ceil(newHeight));
  }

  setTimeout(resizePopout, 100);
});


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

// Attach tooltip 
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

  // It's Log, from Blam-O!
  function addLogEntry(message) {
    if (!logDiv) return;

    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()} | ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
    const entry = `[${timestamp}] ${message}`;

    let color = "#ffffff"; // default
    if (/^Lost\s/.test(message) || /flipped/i.test(message) || /cleared/i.test(message)) {
      color = "#ffbe32"; // yellow
    } else if (/^Acquired\s/.test(message) || /flipped/i.test(message)) {
      color = "#0384fc"; // blue
    }

    const entryDiv = document.createElement('div');
    entryDiv.textContent = entry;
    entryDiv.style.color = color;

    logDiv.appendChild(entryDiv);
    logDiv.scrollTop = logDiv.scrollHeight;

    const logs = JSON.parse(localStorage.getItem("operationLog") || "[]");
    logs.push({ message: entry, color });
    localStorage.setItem("operationLog", JSON.stringify(logs));
  }

  // Memory Card
  function saveCardState(id, state) {
    localStorage.setItem(id, state);
  }

// Start Menu
(function setupHelpMenu() {
  const startBtn = document.getElementById('startBtn');
  if (!startBtn) return;

  // Create menu
  const helpMenu = document.createElement('div');
  helpMenu.id = 'helpMenu';
  Object.assign(helpMenu.style, {
    position: 'fixed',
    bottom: '28px',
    left: '0px',
    width: '255px',
    backgroundColor: '#c0c0c0',
    border: '2px solid #000',
    padding: '4px 0',
    fontFamily: 'Tahoma, sans-serif',
    fontSize: '10px',
    display: 'none',
    zIndex: '9999',
    boxShadow: '2px 2px 0 #808080 inset, -1px -1px 0 #fff inset'
  });

  const helpItems = [
    { icon: 'img/icon-about.png', text: 'How to Use This Checklist:' },
    { icon: 'img/icon-click.png', text: 'Click Cards to Flip' },
    { icon: 'img/icon-unflip.png', text: 'Click Again to Unflip' },
    { icon: 'img/Boost.png', text: 'Locks Flipping/Opens Card Counter' },
    { icon: 'img/BoostUsed.png', text: 'Unlocks Cards and Clears Count' },
    { icon: 'img/PopOut.png', text: 'Pops Out Cards in New Window' },
    { icon: 'img/Close.png', text: 'Close Pop Out to Restore' },
    { icon: 'img/icon-save.png', text: 'Autosaves to localStorage' },
    { icon: 'img/ChocoboWorld.png', text: 'Launch Chocobo World!' },
    { icon: 'img/icon-keys.png', text: 'Boko Uses Arrows/Space/R & E keys' },
    { icon: 'img/icon-screensaver.png', text: 'Launch Screensaver' }
  ];

  helpItems.forEach(item => {
    const line = document.createElement('div');
    line.textContent = item.text;

    // Windows 95 style
    Object.assign(line.style, {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#c0c0c0',
      padding: '2px 6px 2px 48px',
      margin: '0',
      height: '40px',
      lineHeight: '12px',
      fontSize: '10px',
      backgroundImage: `url(${item.icon})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '40px 37px',
      backgroundPosition: '4px center',
      borderTop: '1px solid #fff',
      borderLeft: '1px solid #fff',
      borderBottom: '1px solid #808080',
      borderRight: '1px solid #808080',
      color: '#000',
    });

    // Hover
    line.addEventListener('mouseenter', () => {
      line.style.backgroundColor = '#000080';
      line.style.color = '#fff';
    });
    line.addEventListener('mouseleave', () => {
      line.style.backgroundColor = '#c0c0c0';
      line.style.color = '#000';
    });

    // Clickable
  if (item.text.includes('Pops Out') || item.text.includes('Chocobo') || item.text.includes('Close') || item.text.includes('Screensaver') || item.text.includes('Unflip')) {
      line.style.cursor = 'pointer';
      line.addEventListener('click', () => {
        if (item.text.includes('Pops Out')) {
          const originalPopOutBtn = document.getElementById('popOutBtn');
          if (originalPopOutBtn) originalPopOutBtn.click();
        }
        if (item.text.includes('Chocobo')) {
          const overlay = document.getElementById('boko-overlay');
          if (overlay) overlay.style.display = 'block';
        }
        if (item.text.includes('Close')) {
          if (popOutWin && !popOutWin.closed) {
            popOutWin.close();
            popOutWin = null;
          }
        }
        if (item.text.includes('Screensaver')) {
          const strsBtn = document.getElementById("starsButton");
          if (strsBtn) strsBtn.click();
        }
        if (item.text.includes('Unflip')) {
          const resetBtn = document.getElementById("resetButton");
          if (resetBtn) resetBtn.click();
        }
      });
    }

    helpMenu.appendChild(line);
  });

  document.body.appendChild(helpMenu);


  // Toggle menu
  startBtn.addEventListener('click', e => {
    e.stopPropagation();
    helpMenu.style.display = helpMenu.style.display === 'none' ? 'block' : 'none';
  });

  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!helpMenu.contains(e.target) && e.target !== startBtn) {
      helpMenu.style.display = 'none';
    }
  });
})();

   // Chocobo World
const overlay = document.getElementById("boko-overlay");
const iframe = document.querySelector("#boko-wrapper iframe");
const closeHotspot = document.getElementById("boko-close-hotspot");
function showBokoOverlay() {
  overlay.style.display = "block";
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
  overlay.style.display = "none";
  const cwBtn = document.getElementById("cwBtn");
  if (cwBtn) cwBtn.focus();
}

closeHotspot.addEventListener("click", hideBokoOverlay);
  const cwBtn = document.getElementById("cwBtn");
if (cwBtn) {
  cwBtn.addEventListener("click", showBokoOverlay);
}
  });
