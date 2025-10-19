document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");
  const body = document.body;

  if (themeToggle) {
    // Verificar tema salvo no localStorage
    const savedTheme = localStorage.getItem("theme") || "dark";
    body.classList.toggle("light-theme", savedTheme === "light");

    themeToggle.addEventListener("click", function () {
      body.classList.toggle("light-theme");
      const isLightTheme = body.classList.contains("light-theme");
      localStorage.setItem("theme", isLightTheme ? "light" : "dark");
    });
  }

  // Funcionalidade do menu hambúrguer
  const hamburger = document.getElementById("hamburger");
  const siteNav = document.getElementById("siteNav");
  const mobileOverlay = document.getElementById("mobileOverlay");

  if (hamburger && siteNav && mobileOverlay) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      siteNav.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
    });

    // Fechar menu ao clicar em um link
    const navLinks = siteNav.querySelectorAll("a");
    navLinks.forEach(link => {
      link.addEventListener("click", function () {
        hamburger.classList.remove("active");
        siteNav.classList.remove("active");
        mobileOverlay.classList.remove("active");
      });
    });

    // Fechar menu ao clicar no overlay
    mobileOverlay.addEventListener("click", function () {
      hamburger.classList.remove("active");
      siteNav.classList.remove("active");
      mobileOverlay.classList.remove("active");
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && siteNav.classList.contains("active")) {
        hamburger.classList.remove("active");
        siteNav.classList.remove("active");
        mobileOverlay.classList.remove("active");
      }
    });
  }

  // Funcionalidade de header sticky
  const siteHeader = document.querySelector('.site-header');
  
  if (siteHeader) {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 50) {
        siteHeader.classList.add('sticky');
      } else {
        siteHeader.classList.remove('sticky');
      }
      
      lastScrollTop = scrollTop;
    });
  }

  // Funcionalidade do carrossel
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
