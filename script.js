// Back
const backImage = "img/TTBackLg.png";

// Flip Card Front
function flipCard(card, frontImage) {
  card.src = frontImage;
  saveCardState(card.dataset.cardId, frontImage);
}

// Flip Card Back
function unflipCard(card) {
  card.src = backImage;
  saveCardState(card.dataset.cardId, backImage);
}

// Save State
function saveCardState(id, src) {
  localStorage.setItem(id, src);
}

window.onload = function () {
  let counter = 1;

  document.querySelectorAll("table img").forEach(card => {
    // give each card a unique "card-#" ID if it doesn't already have one
    if (!card.dataset.cardId) {
      card.dataset.cardId = "card-" + counter++;
    }

    // Restore State
    const saved = localStorage.getItem(card.dataset.cardId);
    if (saved) {
      card.src = saved;
    }

    // Assign IDs
    const frontImage = "img/TT" + card.title.replace(/\s+/g, '') + ".png";

    // Click Handlers
    card.addEventListener("click", () => flipCard(card, frontImage));
    card.addEventListener("dblclick", () => unflipCard(card));
  });
};

// Sync Cards
window.addEventListener("storage", function (event) {
  if (event.key && event.key.startsWith("card-")) {
    const card = document.querySelector(`[data-card-id="${event.key}"]`);
    if (card) {
      card.src = event.newValue;
    }
  }
});

// Clear Card Local Storage
document.getElementById("resetBtn").addEventListener("click", () => {
  document.querySelectorAll("table img").forEach((card, index) => {
    const cardId = card.dataset.cardId;
    if (cardId && cardId.startsWith("card-")) {
      localStorage.removeItem(cardId); // remove saved state

      // Add a slight stagger so cards flip sequentially
      setTimeout(() => {
        card.style.transition = "transform 0.4s";
        card.style.transform = "rotateY(90deg)";

        setTimeout(() => {
          card.src = backImage; // flip to back image
          card.style.transform = "rotateY(0deg)";
        }, 400);
      }, index * 10); // stagger by 50ms each card
    }
  });
});
