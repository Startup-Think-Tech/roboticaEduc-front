const loadTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.classList.toggle(
    "light-theme",
    savedTheme === "light"
  );
};

loadTheme();

document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("themeToggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      document.documentElement.classList.toggle("light-theme");
      const isLightTheme =
        document.documentElement.classList.contains("light-theme");
      localStorage.setItem("theme", isLightTheme ? "light" : "dark");
    });
  }

  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
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
    navLinks.forEach((link) => {
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
  const siteHeader = document.querySelector(".site-header");

  if (siteHeader) {
    let lastScrollTop = 0;

    window.addEventListener("scroll", function () {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > 50) {
        siteHeader.classList.add("sticky");
      } else {
        siteHeader.classList.remove("sticky");
      }

      lastScrollTop = scrollTop;
    });
  }

  // Funcionalidade do carrossel da equipe
  const carrosselContainer = document.querySelector(".conteiner-membros");
  const prevBtn = document.querySelector(".carrossel-btn--prev");
  const nextBtn = document.querySelector(".carrossel-btn--next");

  if (carrosselContainer && prevBtn && nextBtn) {
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
  }

  // Carrossel automático de Planejamento
  const carouselWrapper = document.getElementById("carouselWrapper");
  const carouselIndicators = document.getElementById("carouselIndicators");

  if (carouselWrapper && carouselIndicators) {
    const slides = carouselWrapper.querySelectorAll(".carousel-slide");
    const indicators = carouselIndicators.querySelectorAll(".indicator");
    const totalSlides = 6; // Apenas os slides originais (sem contar duplicados)
    const totalSlidesWithDuplicates = slides.length; // Total com duplicados
    
    if (slides.length === 0 || indicators.length === 0) {
      return;
    }

    let currentSlide = 0;
    let carouselInterval = null;
    let isPaused = false;
    let isManualMode = false;
    let resumeTimeout = null;

    const getContainerWidth = () => {
      const container = carouselWrapper.parentElement;
      return container ? container.offsetWidth : 0;
    };

    const updateCarousel = () => {
      const containerWidth = getContainerWidth();
      if (containerWidth === 0) return;

      const translateX = -(currentSlide * containerWidth);
      carouselWrapper.style.transition = "transform 0.8s ease-in-out";
      carouselWrapper.style.transform = `translateX(${translateX}px)`;

      // Atualizar indicadores baseado no slide real (0-5)
      const realSlideIndex = currentSlide % totalSlides;
      indicators.forEach((indicator, index) => {
        if (index === realSlideIndex) {
          indicator.classList.add("active");
        } else {
          indicator.classList.remove("active");
        }
      });
    };

    const nextSlide = () => {
      if (isManualMode || isPaused) {
        return;
      }
      currentSlide++;
      
      // Quando chegar ao último slide original, continuar com os duplicados
      // Quando chegar ao final dos duplicados, resetar suavemente para o início
      if (currentSlide >= totalSlidesWithDuplicates) {
        // Resetar sem transição visível
        carouselWrapper.style.transition = "none";
        currentSlide = 0;
        const containerWidth = getContainerWidth();
        carouselWrapper.style.transform = `translateX(0px)`;
        // Reativar transição após um frame
        setTimeout(() => {
          carouselWrapper.style.transition = "transform 0.8s ease-in-out";
        }, 50);
      }
      
      updateCarousel();
    };

    const startCarousel = () => {
      stopCarousel();
      // Muda de slide a cada 1 segundo sem parar
      carouselInterval = setInterval(nextSlide, 2000);
    };

    const stopCarousel = () => {
      if (carouselInterval) {
        clearInterval(carouselInterval);
        carouselInterval = null;
      }
    };

    const goToSlide = (slideIndex) => {
      if (slideIndex < 0 || slideIndex >= totalSlides) {
        return;
      }

      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      isManualMode = true;
      stopCarousel();

      currentSlide = slideIndex;
      updateCarousel();

      // Retomar animação automática após 1.5 segundos
      resumeTimeout = setTimeout(() => {
        isManualMode = false;
        startCarousel();
      }, 2000);
    };

    // Adicionar event listeners aos indicadores para navegação manual
    indicators.forEach((indicator, index) => {
      indicator.style.cursor = "pointer";
      indicator.setAttribute("tabindex", "0");
      indicator.setAttribute("role", "button");

      // Usar múltiplos tipos de eventos para garantir que funcione
      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(index);
      };

      // Adicionar listeners
      indicator.addEventListener("click", handleClick);
      indicator.addEventListener("mousedown", handleClick);
      indicator.addEventListener("touchstart", handleClick);

      // Listener adicional para garantir funcionamento
      indicator.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        goToSlide(index);
      };
    });

    // Inicializar carrossel
    currentSlide = 0;
    updateCarousel();

    // Iniciar carrossel automático
    setTimeout(() => {
      startCarousel();
    }, 100);

    // Pausar ao passar o mouse e retomar ao sair
    const carouselContainer = carouselWrapper.closest(".carousel-container");
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", () => {
        isPaused = true;
        stopCarousel();
      });
      carouselContainer.addEventListener("mouseleave", () => {
        if (!isManualMode) {
          isPaused = false;
          startCarousel();
        }
      });
    }
  }
});
