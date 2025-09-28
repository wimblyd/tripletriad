document.addEventListener("DOMContentLoaded", () => {
  const rows = 12;
  const cols = 20;
  let finishedCount = 0;
  const totalSquares = rows * cols;

  const overlay = document.getElementById("transition-overlay");
  const cards = Array.from(document.querySelectorAll(".card"));
  const resetButton = document.getElementById("resetButton");

  // ===== Build Squares Dynamically =====
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const square = document.createElement("div");
      square.style.animationDelay = `${(r + c) * 50}ms`;
      overlay.appendChild(square);

      square.addEventListener("animationend", () => {
        finishedCount++;
        if (finishedCount === totalSquares) {
          overlay.classList.add("fade-out");

          setTimeout(() => {
            overlay.style.display = "none";
            document.body.style.backgroundImage = 'url("img/GardenFestivalBkg.jpg")';
            document.getElementById("main-content").style.display = "block";
          }, 1000);
        }
      });
    }
  }

  // ===== Restore Operation Log =====
  const logDiv = document.getElementById('operation-log');
  const savedLogs = JSON.parse(localStorage.getItem("operationLog") || "[]");
  savedLogs.forEach(entry => {
    const div = document.createElement('div');
    div.textContent = entry;
    logDiv.appendChild(div);
  });
  logDiv.scrollTop = logDiv.scrollHeight;

  // ===== Card Setup =====
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

  // ===== Unflip All =====
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

  // ===== Storage Sync =====
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

  // ===== Copy Log Button =====
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

  // ===== Guide Button =====
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

  // ===== Clear Log Button =====
  const clearLogButton = document.getElementById("clearLogButton");
  if (clearLogButton) {
    clearLogButton.addEventListener("click", () => {
      if (logDiv) {
        logDiv.innerHTML = "";
      }

      const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
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

  // ===== Load Operation Log from JSON =====
  async function loadOperationLog() {
    try {
      const response = await fetch('log.json');
      if (!response.ok) throw new Error('Failed to fetch log');
      const logEntries = await response.json();
      logDiv.innerHTML = '';
      logEntries.forEach(entry => {
        const div = document.createElement('div');
        div.textContent = `[${entry.timestamp}] ${entry.message}`;
        logDiv.appendChild(div);
      });
      logDiv.scrollTop = logDiv.scrollHeight;
    } catch (err) {
      console.error('Error loading operation log:', err);
    }
  }

  loadOperationLog();
  setInterval(loadOperationLog, 5000);

  // ===== Log Entry Helper =====
  function addLogEntry(message) {
    if (!logDiv) return;
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const entry = `[${timestamp}] ${message}`;

    const div = document.createElement('div');
    div.textContent = entry;
    logDiv.appendChild(div);

    logDiv.scrollTop = logDiv.scrollHeight;

    let logs = JSON.parse(localStorage.getItem("operationLog") || "[]");
    logs.push(entry);
    localStorage.setItem("operationLog", JSON.stringify(logs));
  }

  // ===== Save Card State Helper =====
  function saveCardState(id, state) {
    localStorage.setItem(id, state);
  }
});
