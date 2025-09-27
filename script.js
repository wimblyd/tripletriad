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
