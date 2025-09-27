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

// Assign IDs
window.onload = function() {
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
  });
};
