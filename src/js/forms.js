const API_BASE_URL = "https://robotica-edu-back.vercel.app";

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

const initFormValidation = (formId) => {
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

      if (formId === "feedbackForm") {
        submitFeedbackWithToast(data);
      }
    }
  });
};

const setupStarRating = () => {
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

const submitFeedbackWithToast = async (formData) => {
  try {
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
  }
};

const submitContactWithToast = async (formData) => {
  try {
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
  }
};

const initContactForm = () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    await submitContactWithToast(data);
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
  initFormValidation("feedbackForm");
  initContactForm();
});
