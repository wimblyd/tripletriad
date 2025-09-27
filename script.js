// Back of the card
const backImage = "img/TTBackLg.png";

// Flip card front
function flipCard(card, frontImage) {
  card.src = frontImage;
  saveCardState(card.dataset.cardId, frontImage);
}

// Flip card back
function unflipCard(card) {
  card.src = backImage;
  saveCardState(card.dataset.cardId, backImage);
}

// Save state
function saveCardState(id, src) {
  localStorage.setItem(id, src);
}

// Assign IDs automatically + restore state
window.onload = function() {
  let counter = 1;

  document.querySelectorAll("table img").forEach(card => {
    // give each card a unique "card-#" ID if it doesn't have one
    if (!card.dataset.cardId) {
      card.dataset.cardId = "card-" + counter++;
    }

    // restore its saved state
    const saved = localStorage.getItem(card.dataset.cardId);
    if (saved) {
      card.src = saved;
    }
  });
};

// Path to the back image
const backImage = "img/TTBackLg.png";

// Flip card to show its front image
function flipCard(card, frontImage) {
  card.src = frontImage;
  saveCardState(card.id, frontImage);
}

// Flip card back
function unflipCard(card) {
  card.src = backImage;
  saveCardState(card.id, backImage);
}

// Save card state in localStorage
function saveCardState(id, src) {
  localStorage.setItem(id, src);
}

// Restore card states on page load
window.onload = function() {
  document.querySelectorAll("img[id^='card-']").forEach(card => {
    const saved = localStorage.getItem(card.id);
    if (saved) {
      card.src = saved;
    }
  });
};
