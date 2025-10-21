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

const displayStatusMessage = (type, message) => {
  const statusDiv = document.getElementById("statusMessage");
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    statusDiv.style.display = "block";

    setTimeout(() => {
      statusDiv.style.display = "none";
      statusDiv.className = "status-message";
    }, 5000);
  }
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
      } else {
        displayStatusMessage("success", "Sucesso! Seu formulário foi enviado.");
        form.reset();
        form
          .querySelectorAll(".form-group")
          .forEach((group) => group.classList.remove("error"));
      }
    } else {
      displayStatusMessage(
        "error",
        "Erro! Por favor, preencha os campos obrigatórios/inválidos."
      );
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

const submitFeedbackWithToast = (formData) => {
  setTimeout(() => {
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
  }, 1000);
};

const submitContactWithToast = (formData) => {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.querySelector(".toast-message h4").textContent = "Mensagem Enviada!";
    toast.querySelector(".toast-message p").textContent =
      "Obrigado pelo seu contato! Retornaremos em breve.";
    showToast();
  }
};

const initContactForm = () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    console.log("Dados do formulário de contato (mockado):", data);

    submitContactWithToast(data);
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
