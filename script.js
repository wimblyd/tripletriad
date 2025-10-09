  document.addEventListener("DOMContentLoaded", () => {
 
  // Come on and get your Log!
  const logDiv = document.getElementById('operation-log');
  const savedLogs = JSON.parse(localStorage.getItem("operationLog") || "[]");
  savedLogs.forEach(entry => {
    const div = document.createElement('div');
    div.textContent = entry;
    logDiv.appendChild(div);
  });
  logDiv.scrollTop = logDiv.scrollHeight;

  // I Don't Like Labels
 document.querySelectorAll('.card').forEach(card => {
  const label = document.createElement('div');
  label.className = 'card-label';
  label.textContent = card.title || card.querySelector('.card-front')?.alt || '';
  card.insertAdjacentElement('afterend', label);
});

  // Shuffle or Boogie
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const id = card.dataset.cardId;
    const savedState = localStorage.getItem(id);

    if (savedState === "flipped") {
      card.classList.add("flipped");
    } else {
      card.classList.remove("flipped");
    }
   
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", card.classList.contains("flipped") ? "true" : "false");

    const toggleFlip = () => {
      card.classList.toggle("flipped");
      const state = card.classList.contains("flipped") ? "flipped" : "unflipped";
      saveCardState(id, state);
      card.setAttribute("aria-pressed", card.classList.contains("flipped") ? "true" : "false");
      addLogEntry(`${card.title} was ${state}`);
    };

    card.addEventListener("click", toggleFlip);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
    });
  });

  // Unflip All
  const resetButton = document.getElementById("resetButton");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      cards.forEach(card => {
        card.classList.remove("flipped");
        saveCardState(card.dataset.cardId, "unflipped");
        card.setAttribute("aria-pressed", "false");
      });
      addLogEntry("Cards unflipped");
    });
  }

  // Sync
  window.addEventListener("storage", (event) => {
    if (event.key && event.key.startsWith("card-")) {
      const card = document.querySelector(`[data-card-id="${event.key}"]`);
      if (card) {
        if (event.newValue === "flipped") {
          card.classList.add("flipped");
          card.setAttribute("aria-pressed", "true");
        } else {
          card.classList.remove("flipped");
          card.setAttribute("aria-pressed", "false");
        }
      }
    }
  });

  // Copy Log
  const copyLogButton = document.getElementById("copyLogButton");
  if (copyLogButton) {
    copyLogButton.addEventListener("click", () => {
      const logDiv = document.getElementById("operation-log");
      if (!logDiv) return;

      const text = Array.from(logDiv.children)
        .map(div => div.textContent)
        .join("\n");

      navigator.clipboard.writeText(text)
        .then(() => {
          addLogEntry("Log copied to clipboard");
          copyLogButton.src = "img/CopyButton2.png";
          setTimeout(() => {
            copyLogButton.src = "img/CopyButton.png";
          }, 500);
        })
        .catch(err => {
          console.error("Failed to copy log:", err);
        });
    });
  }

    // Clear Log
const clearLogButton = document.getElementById("clearLogButton");
if (clearLogButton) {
  clearLogButton.addEventListener("click", () => {
    if (logDiv) {
      logDiv.innerHTML = "";
    }

    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'short' });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const timestamp = `${day} ${month} ${year} | ${time}`;

    const entry = `[${timestamp}] Log cleared`;

    localStorage.setItem("operationLog", JSON.stringify([entry]));

    const div = document.createElement("div");
    div.textContent = entry;
    logDiv.appendChild(div);
    logDiv.scrollTop = logDiv.scrollHeight;

    clearLogButton.src = "img/ClearButton2.png";
    setTimeout(() => {
      clearLogButton.src = "img/ClearButton.png";
    }, 500);
  });
}

    // Guide Button
  const guideButton = document.getElementById("guideButton");
  if (guideButton) {
    guideButton.addEventListener("click", () => {
      guideButton.src = "img/GuideButton2.png";
      setTimeout(() => {
        guideButton.src = "img/GuideButton.png";
        window.open(
          "https://www.dropbox.com/scl/fi/wzkqfhaz78xm8aazuwyoe/Wimbly-Donner-s-Guide-to-Triple-Triad-v.03.2.pdf?rlkey=v5blv7r5kodab77ksk71ll0sx&e=1&st=srlyik69&dl=1",
          "_blank"
        );
      }, 500);
    });
  }

    // For the Grind
(function addCardCounters() {
  const counterCardIds = [
    ...Array(47).fill().map((_, i) => i + 1),   // 1–47
    ...Array(29).fill().map((_, i) => i + 49)   // 49–77
  ];

  counterCardIds.forEach(id => {
    const card = document.querySelector(`.card[data-card-id="card-${id}"]`);
    if (!card) return;

    const cardInner = card.querySelector(".card-inner");
    const frontFace = card.querySelector(".card-front");
    const counter = document.createElement("div");
    counter.className = "card-counter";
    counter.dataset.cardId = id;

    const upArrow = document.createElement("img");
    upArrow.className = "counter-arrow up";
    upArrow.src = "img/UpArrow.png";
    upArrow.alt = "+1";

    const numberContainer = document.createElement("div");
    numberContainer.className = "counter-number-container";

    const downArrow = document.createElement("img");
    downArrow.className = "counter-arrow down";
    downArrow.src = "img/DownArrow.png";
    downArrow.alt = "-1";

    counter.appendChild(upArrow);
    counter.appendChild(numberContainer);
    counter.appendChild(downArrow);

    // Boost
    const boost = document.createElement("img");
    boost.className = "boost-button";
    boost.src = "img/Boost.png";
    boost.alt = "Show counter";

    frontFace.appendChild(boost);
    frontFace.appendChild(counter);

    // That's Numberwang!
    function renderNumber(count) {
      numberContainer.innerHTML = "";

      if (count >= 100) {
        const star = document.createElement("img");
        star.src = "img/Star.png";
        star.alt = "100";
        star.className = "counter-number";
        numberContainer.appendChild(star);
        return;
      }

      const digits = count.toString().split("");
      digits.forEach(d => {
        const digitImg = document.createElement("img");
        digitImg.src = `img/${d}.png`;
        digitImg.alt = d;
        digitImg.className = "counter-number";
        numberContainer.appendChild(digitImg);
      });
    }

    let count = parseInt(localStorage.getItem(`card-${id}-count`) || "1", 10);
    renderNumber(count);

    const updateCount = (delta) => {
      count = Math.max(1, Math.min(100, count + delta)); // start at 1, clamp 1–100
      localStorage.setItem(`card-${id}-count`, count);
      renderNumber(count);
    };

    upArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      updateCount(1);
    });

    downArrow.addEventListener("click", (e) => {
      e.stopPropagation();
      updateCount(-1);
    });

    // Clicky
    boost.addEventListener("click", (e) => {
      e.stopPropagation();
      counter.classList.toggle("visible");
    });
  });
})();

 // It's Log! From Blam-O!
function addLogEntry(message) {
  if (!logDiv) return;
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = now.toLocaleString('en-US', { month: 'short' });
  const year = now.getFullYear();
  const time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const timestamp = `${day} ${month} ${year} | ${time}`;
  const entry = `[${timestamp}] ${message}`;

  const div = document.createElement('div');
  div.textContent = entry;
  logDiv.appendChild(div);

  logDiv.scrollTop = logDiv.scrollHeight;

  let logs = JSON.parse(localStorage.getItem("operationLog") || "[]");
  logs.push(entry);
  localStorage.setItem("operationLog", JSON.stringify(logs));
}

  // Memory Card
  function saveCardState(id, state) {
    localStorage.setItem(id, state);
  }
});
