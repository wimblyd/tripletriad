document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const resetButton = document.getElementById("resetButton");

  // Restore saved states
  cards.forEach(card => {
    const id = card.dataset.cardId;
    const savedState = localStorage.getItem(id);

    if (savedState === "flipped") {
      card.classList.add("flipped");
    } else {
      card.classList.remove("flipped");
    }

    // Click to flip
    card.addEventListener("click", () => {
      card.classList.add("flipped");
      saveCardState(id, "flipped");
    });

    // Double-click to unflip
    card.addEventListener("dblclick", () => {
      card.classList.remove("flipped");
      saveCardState(id, "unflipped");
    });
  });

  // Reset all cards
  resetButton.addEventListener("click", () => {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove("flipped");
        saveCardState(card.dataset.cardId, "unflipped");
      }, index * 50); // staggered animation
    });
  });

  // Sync across tabs
  window.addEventListener("storage", event => {
    if (event.key && event.key.startsWith("card-")) {
      const card = document.querySelector(`[data-card-id="${event.key}"]`);
      if (card) {
        if (event.newValue === "flipped") {
          card.classList.add("flipped");
        } else {
          card.classList.remove("flipped");
        }
      }
    }
  });
});

// Save helper
function saveCardState(id, state) {
  localStorage.setItem(id, state);
}
