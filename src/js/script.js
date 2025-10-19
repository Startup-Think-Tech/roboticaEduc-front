document.addEventListener("DOMContentLoaded", function () {
  const carrosselContainer = document.querySelector(".conteiner-membros");
  const prevBtn = document.querySelector(".carrossel-btn--prev");
  const nextBtn = document.querySelector(".carrossel-btn--next");

  if (!carrosselContainer || !prevBtn || !nextBtn) {
    return;
  }

  const cards = document.querySelectorAll(".card-membro");
  const totalCards = cards.length;
  let currentIndex = 0;

  function getCardsToShow() {
    if (window.innerWidth <= 768) {
      return 1; // Mobile: 1 card
    } else {
      return 3; // Desktop: 3 cards
    }
  }

  function moveCarrossel(direction) {
    const cardsToShow = getCardsToShow();
    const maxIndex = Math.max(0, totalCards - cardsToShow);

    if (direction === "next") {
      currentIndex = Math.min(currentIndex + 1, maxIndex);
    } else if (direction === "prev") {
      currentIndex = Math.max(currentIndex - 1, 0);
    }

    const cardElement = cards[0];
    const cardWidth = cardElement.offsetWidth + 24;
    const scrollPosition = currentIndex * cardWidth;

    carrosselContainer.scrollTo({
      left: scrollPosition,
      behavior: "smooth",
    });

    updateButtonStates();
  }

  function updateButtonStates() {
    const cardsToShow = getCardsToShow();
    const maxIndex = Math.max(0, totalCards - cardsToShow);

    prevBtn.disabled = currentIndex === 0;
    prevBtn.style.opacity = currentIndex === 0 ? "0.3" : "0.8";

    nextBtn.disabled = currentIndex >= maxIndex;
    nextBtn.style.opacity = currentIndex >= maxIndex ? "0.3" : "0.8";
  }

  prevBtn.addEventListener("click", function () {
    moveCarrossel("prev");
  });

  nextBtn.addEventListener("click", function () {
    moveCarrossel("next");
  });

  updateButtonStates();

  window.addEventListener("resize", function () {
    updateButtonStates();
  });
});
