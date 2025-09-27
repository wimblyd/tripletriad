document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card"));
  const resetButton = document.getElementById("resetButton");

  // Save State
  function saveCardState(id, state) {
    if (!id) return;
    localStorage.setItem(id, state);
  }

  // Initialize
    cards.forEach(card => {
    const id = card.dataset.cardId;
    const savedState = localStorage.getItem(id);

  // Restore
    if (savedState === "flipped") {
      card.classList.add("flipped");
    } else {
      card.classList.remove("flipped");
    }

  // Accessibility
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", card.classList.contains("flipped") ? "true" : "false");

  // Toggle Function
    const toggleFlip = (event) => {
      // if the click came from an inner control that should not toggle, handle it there.
      card.classList.toggle("flipped");
      const state = card.classList.contains("flipped") ? "flipped" : "unflipped";
      saveCardState(id, state);
      card.setAttribute("aria-pressed", card.classList.contains("flipped") ? "true" : "false");
    };

    // Click
    card.addEventListener("click", toggleFlip);

    // Keyboard
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // prevent page scroll on Space
        toggleFlip(e);
      }
    });
  });

  // Unflip All
  resetButton.addEventListener("click", () => {
    cards.forEach(card => {
      card.classList.remove("flipped");
      saveCardState(card.dataset.cardId, "unflipped");
      card.setAttribute("aria-pressed", "false");
    });
  });

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
});

 // Operation Log
  async function loadOperationLog() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/log.json');
      if (!response.ok) throw new Error('Failed to fetch log');
      const logEntries = await response.json();

      const logDiv = document.getElementById('operation-log');
      if (!logDiv) return; // avoid errors if div doesn't exist
      logDiv.innerHTML = '';

      logEntries.forEach(entry => {
        const div = document.createElement('div');
        div.textContent = `[${entry.timestamp}] ${entry.message}`;
        logDiv.appendChild(div);
      });

      logDiv.scrollTop = logDiv.scrollHeight; // scroll to latest
    } catch (err) {
      console.error('Error loading operation log:', err);
    }
  }

  // Fetch
  loadOperationLog();
  setInterval(loadOperationLog, 5000);
});
