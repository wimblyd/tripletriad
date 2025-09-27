document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card"));
  const resetButton = document.getElementById("resetButton");

  function saveCardState(id, state) {
    if (!id) return;
    localStorage.setItem(id, state);
  }

  // Per-card setup
  cards.forEach(card => {
    const id = card.dataset.cardId;
    const savedState = localStorage.getItem(id);

    // Restore state
    if (savedState === "flipped") {
      card.classList.add("flipped");
    } else {
      card.classList.remove("flipped"); // back shows by default
    }

    // Accessibility
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", card.classList.contains("flipped") ? "true" : "false");

    // Toggle
    const toggleFlip = () => {
      card.classList.toggle("flipped");
      const state = card.classList.contains("flipped") ? "flipped" : "unflipped";
      saveCardState(id, state);
      card.setAttribute("aria-pressed", card.classList.contains("flipped") ? "true" : "false");

      // Log
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
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      cards.forEach(card => {
        card.classList.remove("flipped"); // back side visible
        saveCardState(card.dataset.cardId, "unflipped");
        card.setAttribute("aria-pressed", "false");
        addLogEntry(`${card.title} was unflipped`);
      });
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

  // Operation log loader
  async function loadOperationLog() {
    try {
      const response = await fetch('log.json');
      if (!response.ok) throw new Error('Failed to fetch log');
      const logEntries = await response.json();
      const logDiv = document.getElementById('operation-log');
      if (!logDiv) return;
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
});

// Log Entries
function addLogEntry(message) {
  const logDiv = document.getElementById('operation-log');
  if (!logDiv) return;

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const div = document.createElement('div');
  div.textContent = `[${timestamp}] ${message}`;
  logDiv.appendChild(div);

  // Scroll to bottom automatically
  logDiv.scrollTop = logDiv.scrollHeight;
}
