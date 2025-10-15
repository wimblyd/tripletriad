document.addEventListener("DOMContentLoaded", () => {
  const logDiv = document.getElementById('operation-log');

 // Mobile-only Log Dropdown
  const logToggleBar = document.getElementById('logToggleBar');
  if (logToggleBar && logDiv) {
    const arrow = logToggleBar.querySelector('.arrow');
    if (window.innerWidth <= 480) logDiv.classList.add('mobile-hidden');
    logToggleBar.addEventListener('click', () => {
      if (logDiv.classList.contains('mobile-hidden')) {
        logDiv.classList.remove('mobile-hidden');
        logToggleBar.style.display = 'none';
      } else {
        logDiv.classList.add('mobile-hidden');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      }
    });
  }

  // Start Menu
  (function setupHelpMenu() {
    const helpStyle = document.createElement('style');
    helpStyle.textContent = `...`; // style as above
    document.head.appendChild(helpStyle);

    const helpMenu = document.createElement('div');
    helpMenu.id = 'helpMenu';
    ["Click to Flip","Click to Unflip","Boost Button Locks Flipping..."].forEach(line => {
      const div = document.createElement('div');
      div.textContent = line;
      helpMenu.appendChild(div);
    });
    document.body.appendChild(helpMenu);

    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.addEventListener('click', () => helpMenu.classList.toggle('show'));

    document.addEventListener('click', e => {
      if (!helpMenu.contains(e.target) && e.target !== startBtn) helpMenu.classList.remove('show');
    });
  })();

  
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
          const star = Object.assign(document.createElement("img"), {
            src: "img/Star.png",
            alt: "100",
            className: "counter-number"
          });
          numberContainer.appendChild(star);
        } else {
          newCount.toString().split("").forEach(d => {
            const digitImg = Object.assign(document.createElement("img"), {
              src: `img/${d}.png`,
              alt: d,
              className: "counter-number"
            });
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
      const boost = document.querySelector(`.card[data-card-id="card-${id}"] .boost-button`);
      const card = document.querySelector(`.card[data-card-id="card-${id}"]`);
      if (boost && card) {
        if (event.newValue === "used") {
          boost.classList.add("used");
          if (card.classList.contains("flipped")) card.classList.add("boost-locked");
        } else {
          boost.classList.remove("used");
          card.classList.remove("boost-locked");
        }
      }
    }
  });

  // Copy log
  document.getElementById("copyLogButton")?.addEventListener("click", () => {
    const text = Array.from(logDiv.children).map(div => div.textContent).join("\n");
    navigator.clipboard.writeText(text)
      .then(() => addLogEntry("Log copied to clipboard"))
      .catch(err => console.error("Failed to copy log:", err));
  });

  // Clear log
  document.getElementById("clearLogButton")?.addEventListener("click", () => {
    logDiv.innerHTML = "";
    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear()} | ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
    const entry = `[${timestamp}] Log cleared`;
    localStorage.setItem("operationLog", JSON.stringify([entry]));
    logDiv.appendChild(Object.assign(document.createElement("div"), { textContent: entry }));
    logDiv.scrollTop = logDiv.scrollHeight;
  });

  // Guide
  document.getElementById("guideButton")?.addEventListener("click", () => {
    window.open("https://www.dropbox.com/scl/fi/wzkqfhaz78xm8aazuwyoe/Wimbly-Donner-s-Guide-to-Triple-Triad-v.03.2.pdf?rlkey=v5blv7r5kodab77ksk71ll0sx&e=1&st=srlyik69&dl=1", "_blank");
    addLogEntry("Guide Downloaded");
  });

  // Mathemathical!
  (function addCardCounters() {
    const counterCardIds = [...Array(47).keys()].map(i => i + 1).concat([...Array(29).keys()].map(i => i + 49));
    counterCardIds.forEach(id => {
      const card = document.querySelector(`.card[data-card-id="card-${id}"]`);
      if (!card) return;

      const cardInner = card.querySelector(".card-inner");

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

      let count = parseInt(localStorage.getItem(`card-${id}-count`) || "1", 10);

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
      };

      renderNumber(count);

      const updateCount = delta => {
        count = Math.max(0, Math.min(100, count + delta));
        localStorage.setItem(`card-${id}-count`, count);
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
          localStorage.setItem(`card-${id}-count`, count);
          renderNumber(count);
          counter.classList.add("visible");
          boost.classList.add("used");
          localStorage.setItem(boostKey, "used");

          if (card.classList.contains("flipped")) {
            card.classList.add("boost-locked");
          }

          addLogEntry(`${card.title} count changed to ${count}`);
        } else {
          count = 0;
          localStorage.setItem(`card-${id}-count`, count);
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
      margin: 10px; /* keep some padding from edges */
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
tooltip.textContent = "Pop Out The Card Screen";
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

popOutButton.addEventListener("mouseenter", e => {
  const x = e.clientX + 10;
  const y = Math.max(0, e.clientY - 30);
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.style.opacity = "1";
});

popOutButton.addEventListener("mousemove", e => {
  const x = e.clientX + 10;
  const y = Math.max(0, e.clientY - 30);
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
});

popOutButton.addEventListener("mouseleave", () => {
  tooltip.style.opacity = "0";
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

});
