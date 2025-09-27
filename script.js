// Back
const backImage = "img/TTBackLg.png";

// Flip 
function flipCard(card, frontImage) {
  card.src = frontImage;
  saveCardState(card.dataset.cardId, frontImage);
}

// Unflip
function unflipCard(card) {
  card.src = backImage;
  saveCardState(card.dataset.cardId, backImage);
}

// Save State
function saveCardState(id, src) {
  localStorage.setItem(id, src);
}

// On Load
window.onload = function () {
  let counter = 1;

  document.querySelectorAll("table img").forEach(card => {
    if (!card.dataset.cardId) {
      card.dataset.cardId = "card-" + counter++;
    }

    const frontImage = "img/TT" + card.title.replace(/\s+/g, '') + ".png";
    const saved = localStorage.getItem(card.dataset.cardId);

    if (saved && saved !== backImage) {
      flipCard(card, frontImage);
    } else {
      unflipCard(card);
    }

    card.addEventListener("click", () => flipCard(card, frontImage));
    card.addEventListener("dblclick", () => unflipCard(card));
  });
};

// Reset
document.getElementById("resetButton").addEventListener("click", () => {
  document.querySelectorAll("table img").forEach((card, index) => {
    const cardId = card.dataset.cardId;
    if (cardId && cardId.startsWith("card-")) {
      localStorage.removeItem(cardId);

      // Animation: staggered flip back
      setTimeout(() => {
        card.style.transition = "transform 0.2s";
        card.style.transform = "rotateY(90deg)";

        setTimeout(() => {
          unflipCard(card);
          card.style.transform = "rotateY(0deg)";
        }, 200);
      }, index * 50);
    }
  });
});

// Sync Cards
window.addEventListener("storage", function (event) {
  if (event.key && event.key.startsWith("card-")) {
    const card = document.querySelector(`[data-card-id="${event.key}"]`);
    if (card) {
      card.src = event.newValue;
    }
  }
});
