import { API_URL } from "./config.js";

const API_BASE_URL = API_URL;

let isFeedbackSubmitting = false;
let isContactSubmitting = false;

const escapeHtml = (text) => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

export const loadLatestFeedbacks = async () => {
  const loadingElement = document.getElementById("feedbackLoading");
  const gridElement = document.getElementById("feedbackCardsGrid");

  if (loadingElement) {
    loadingElement.classList.remove("hidden");
  }
  if (gridElement) {
    gridElement.classList.add("hidden");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/feedbacks`);
    const responseText = await response.text();

    if (!response.ok) {
      if (loadingElement) {
        loadingElement.classList.add("hidden");
      }
      return;
    }

    const data = JSON.parse(responseText);

    if (data.success && data.data && Array.isArray(data.data)) {
      const sortedByDate = data.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      const latestFeedbacks = sortedByDate.slice(0, 4);
      renderFeedbacks(latestFeedbacks);
    }
  } catch (error) {
    if (loadingElement) {
      loadingElement.classList.add("hidden");
    }
  }
};

const renderFeedbacks = (feedbacks) => {
  const container = document.getElementById("feedbackCardsGrid");
  const loadingElement = document.getElementById("feedbackLoading");

  if (!container) return;

  container.innerHTML = "";

  feedbacks.forEach((feedback) => {
    const card = createFeedbackCard(feedback);
    container.appendChild(card);
  });

  if (loadingElement) {
    loadingElement.classList.add("hidden");
  }
  container.classList.remove("hidden");
};

const createFeedbackCard = (feedback) => {
  const card = document.createElement("div");
  card.className = "feedback-card";

  const stars = createStars(feedback.stars);

  card.innerHTML = `
    <div class="feedback-card-header">
      <div class="person-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
        </svg>
      </div>
      <div class="feedback-info">
        <h3 class="feedback-name">${escapeHtml(feedback.name)}</h3>
        <div class="feedback-stars">
          ${stars}
        </div>
      </div>
    </div>
    <p class="feedback-comment">"${escapeHtml(feedback.comment)}"</p>
  `;

  return card;
};

const createStars = (rating) => {
  let starsHTML = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHTML += '<span class="star filled">★</span>';
    } else {
      starsHTML += '<span class="star empty">☆</span>';
    }
  }
  return starsHTML;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateInput = (inputElement) => {
  const parentGroup = inputElement.closest(".form-group");
  const errorMessageSpan = parentGroup.querySelector(".error-message");
  let isValid = true;
  let message = "";

  if (inputElement.required && !inputElement.value.trim()) {
    isValid = false;
    message = "Este campo é obrigatório.";
  } else if (
    inputElement.type === "email" &&
    !isValidEmail(inputElement.value.trim())
  ) {
    isValid = false;
    message = "Por favor, insira um e-mail válido.";
  } else if (
    inputElement.id === "estrelas" &&
    inputElement.dataset.min &&
    parseInt(inputElement.value) < parseInt(inputElement.dataset.min)
  ) {
    isValid = false;
    message = "Selecione pelo menos uma estrela.";
  }

  if (!isValid) {
    parentGroup.classList.add("error");
    errorMessageSpan.textContent = message;
  } else {
    parentGroup.classList.remove("error");
    errorMessageSpan.textContent = "";
  }

  return isValid;
};

export const initFormValidation = (formId) => {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputElements = form.querySelectorAll(
    "input[required], textarea[required], input[data-min]"
  );

  inputElements.forEach((input) => {
    input.addEventListener("blur", () => {
      validateInput(input);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let formIsValid = true;

    inputElements.forEach((input) => {
      if (!validateInput(input)) {
        formIsValid = false;
      }
    });

    if (formIsValid) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const submitButton = form.querySelector('button[type="submit"]');

      if (formId === "feedbackForm") {
        submitFeedbackWithToast(data, submitButton);
      }
    }
  });
};

export const setupStarRating = () => {
  const starInputs = document.querySelectorAll('input[name="rating"]');

  if (!starInputs.length) return;

  starInputs.forEach((input) => {
    input.addEventListener("change", () => {
      starInputs.forEach((star) => {
        if (star !== input) {
          star.checked = false;
        }
      });

      const parentGroup = input.closest(".form-group");
      if (parentGroup) {
        parentGroup.classList.remove("error");
        const errorMessage = parentGroup.querySelector(".error-message");
        if (errorMessage) {
          errorMessage.textContent = "";
        }
      }
    });
  });
};

const showToast = () => {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }
};

const showErrorToast = () => {
  const toastError = document.getElementById("toastError");
  if (toastError) {
    toastError.classList.add("show");

    setTimeout(() => {
      toastError.classList.remove("show");
    }, 4000);
  }
};

const submitFeedbackWithToast = async (formData, submitButton) => {
  if (isFeedbackSubmitting) return;

  isFeedbackSubmitting = true;

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }

    const response = await fetch(`${API_BASE_URL}/feedbacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.userName,
        stars: parseInt(formData.rating),
        comment: formData.comment,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = "Erro ao enviar feedback";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    try {
      const data = JSON.parse(responseText);
    } catch (e) {}

    showToast();
    loadLatestFeedbacks();

    const form = document.getElementById("feedbackForm");
    if (form) {
      form.reset();

      const starInputs = form.querySelectorAll('input[name="rating"]');
      starInputs.forEach((input) => {
        input.checked = false;
      });

      const errorElements = form.querySelectorAll(".error");
      errorElements.forEach((element) => {
        element.classList.remove("error");
      });

      const errorMessages = form.querySelectorAll(".error-message");
      errorMessages.forEach((message) => {
        message.textContent = "";
      });
    }
  } catch (error) {
    showErrorToast();
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar Feedback";
    }
    isFeedbackSubmitting = false;
  }
};

const submitContactWithToast = async (formData, submitButton) => {
  if (isContactSubmitting) return;

  isContactSubmitting = true;

  try {
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Enviando...";
    }

    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.nome,
        email: formData.email,
        subject: formData.subject,
        message: formData.mensagem,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = "Erro ao enviar mensagem";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    try {
      const data = JSON.parse(responseText);
    } catch (e) {}

    const toast = document.getElementById("toast");
    if (toast) {
      toast.querySelector(".toast-message h4").textContent =
        "Mensagem Enviada!";
      toast.querySelector(".toast-message p").textContent =
        "Obrigado pelo seu contato! Retornaremos em breve.";
      showToast();
    }
  } catch (error) {
    showErrorToast();
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar Mensagem";
    }
    isContactSubmitting = false;
  }
};

const initContactForm = () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    const submitButton = contactForm.querySelector('button[type="submit"]');

    await submitContactWithToast(data, submitButton);
    contactForm.reset();
  });

  const inputs = contactForm.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", () => validateInput(input));
    input.addEventListener("input", () => {
      const parentGroup = input.closest(".form-group");
      if (parentGroup.classList.contains("error")) {
        validateInput(input);
      }
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  loadLatestFeedbacks();
  initFormValidation("feedbackForm");
  initContactForm();
  setupStarRating();
});
