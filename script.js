document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");
  const resetButton = document.getElementById("resetButton");

  // Restore State
  cards.forEach(card => {
    const id = card.dataset.cardId;
    const savedState = localStorage.getItem(id);

    if (savedState === "flipped") {
      card.classList.add("flipped");
    } else {
      card.classList.remove("flipped");
    }

    // Keyboard
   cards.forEach(card => {
  const id = card.dataset.cardId;

  // Toggle flip on click or Enter/Space key
  const toggleFlip = () => {
    card.classList.toggle("flipped");
    const state = card.classList.contains("flipped") ? "flipped" : "unflipped";
    saveCardState(id, state);
  };

  // Click
  card.addEventListener("click", toggleFlip);

  // Keyboard accessibility
  card.setAttribute("tabindex", "0");          // make focusable
  card.setAttribute("role", "button");         // for screen readers
  card.setAttribute("aria-pressed", "false");  // track flipped state
  card.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      toggleFlip();
      card.setAttribute("aria-pressed", card.classList.contains("flipped"));
      e.preventDefault(); // prevent scrolling with Space
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

// Save State
function saveCardState(id, state) {
  localStorage.setItem(id, state);
}
