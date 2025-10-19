/**
 * Variáveis de Configuração Global
 * IMPORTANTE: Configure os endpoints do seu backend aqui.
 */
const ENDPOINTS = {
  contactForm: "http://localhost:3000/api/contato", // Exemplo: Backend rodando na porta 3000
  feedbackForm: "http://localhost:3000/api/feedback",
};

/**
 * ## Funções de Validação
 */

function isValidEmail(email) {
  // Regex simples para validação de formato de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateInput(inputElement) {
  const parentGroup = inputElement.closest(".form-group");
  const errorMessageSpan = parentGroup.querySelector(".error-message");
  let isValid = true;
  let message = "";

  // 1. Validação de campo obrigatório (Geral)
  if (inputElement.required && !inputElement.value.trim()) {
    isValid = false;
    message = "Este campo é obrigatório.";
  }
  // 2. Validação de formato de E-mail
  else if (
    inputElement.type === "email" &&
    !isValidEmail(inputElement.value.trim())
  ) {
    isValid = false;
    message = "Por favor, insira um e-mail válido.";
  }
  // 3. Validação de Estrelas (aplica-se ao campo hidden)
  else if (
    inputElement.id === "estrelas" &&
    inputElement.dataset.min &&
    parseInt(inputElement.value) < parseInt(inputElement.dataset.min)
  ) {
    isValid = false;
    message = "Selecione pelo menos uma estrela.";
  }

  // Atualiza o feedback visual de erro no frontend
  if (!isValid) {
    parentGroup.classList.add("invalid");
    errorMessageSpan.textContent = message;
  } else {
    parentGroup.classList.remove("invalid");
    errorMessageSpan.textContent = "";
  }

  return isValid;
}

/**
 * ## Funções de UI (Feedback Visual)
 */

function displayStatusMessage(type, message) {
  const statusDiv = document.getElementById("statusMessage");
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    statusDiv.style.display = "block";

    // Oculta a mensagem após 5 segundos
    setTimeout(() => {
      statusDiv.style.display = "none";
      statusDiv.className = "status-message";
    }, 5000);
  }
}

/**
 * ## Lógica de Submissão e Integração Backend
 */

/**
 * Centraliza a lógica de validação e o manipulador de envio com integração via Fetch API.
 * @param {string} formId - O ID do formulário a ser inicializado.
 */
function initFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputElements = form.querySelectorAll(
    "input[required], textarea[required], input[data-min]"
  );

  // Adiciona validação em tempo real ao perder o foco (blur)
  inputElements.forEach((input) => {
    input.addEventListener("blur", () => {
      validateInput(input);
    });
  });

  // Manipulador de envio do formulário (ASSÍNCRONO)
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    let formIsValid = true;

    // 1. Roda a validação de todos os campos do frontend
    inputElements.forEach((input) => {
      if (!validateInput(input)) {
        formIsValid = false;
      }
    });

    if (formIsValid) {
      // 2. Coleta dos dados do formulário
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // 3. Define o endpoint
      const endpoint = ENDPOINTS[formId];

      if (!endpoint) {
        return displayStatusMessage(
          "error",
          "❌ Configuração de endpoint não encontrada."
        );
      }

      try {
        // 4. Envio dos dados via Fetch API (POST)
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        // 5. Processamento da resposta
        if (response.ok) {
          // Status HTTP 200-299
          // Pode-se optar por não ler o body se o backend não retornar conteúdo
          // const result = await response.json();

          displayStatusMessage(
            "success",
            "✅ Sucesso! Seu formulário foi enviado."
          );

          form.reset();
          form
            .querySelectorAll(".form-group")
            .forEach((group) => group.classList.remove("invalid"));
        } else {
          // Trata erros de resposta do servidor (4xx, 5xx)
          const errorData = await response
            .json()
            .catch(() => ({ message: "Resposta de erro sem JSON." }));

          console.error("Erro de envio:", response.status, errorData);
          displayStatusMessage(
            "error",
            `❌ Erro (${response.status}): ${
              errorData.message ||
              "Falha ao processar a requisição no servidor."
            }`
          );
        }
      } catch (error) {
        // Trata erros de rede
        console.error("Erro de rede ou fetch:", error);
        displayStatusMessage(
          "error",
          "❌ Erro de conexão! Verifique se o servidor está ativo (CORS)."
        );
      }
    } else {
      // Exibir mensagem de erro de validação de frontend
      displayStatusMessage(
        "error",
        "❌ Erro! Por favor, preencha os campos obrigatórios/inválidos."
      );
    }
  });
}

/**
 * ## Lógica de Avaliação por Estrelas (Feedback)
 */

function setupStarRating() {
  const starsContainer = document.getElementById("stars");
  const hiddenInput = document.getElementById("estrelas");

  if (!starsContainer || !hiddenInput) return;

  const maxStars = 5;

  // Inserir as 5 estrelas no HTML via JS
  for (let i = 1; i <= maxStars; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = "★";
    star.dataset.value = i;
    starsContainer.appendChild(star);
  }

  const allStars = starsContainer.querySelectorAll(".star");

  // 1. Manipular o clique (Seleção Definitiva)
  allStars.forEach((star) => {
    star.addEventListener("click", () => {
      const rating = star.dataset.value;
      hiddenInput.value = rating;

      // Remove a classe 'active' e aplica 'selected' para manter o estado
      allStars.forEach((s) => {
        s.classList.remove("selected", "active");
        if (s.dataset.value <= rating) {
          s.classList.add("selected");
        }
      });
      // Valida o campo hidden para remover erro de "campo obrigatório"
      validateInput(hiddenInput);
    });

    // 2. Manipular o HOVER (Efeito Visual)
    star.addEventListener("mouseover", () => {
      const hoverRating = star.dataset.value;
      allStars.forEach((s) => {
        s.classList.remove("active");
        if (s.dataset.value <= hoverRating) {
          s.classList.add("active");
        }
      });
    });
  });

  // 3. Manipular o Mouse Out (Voltar ao estado selecionado)
  starsContainer.addEventListener("mouseout", () => {
    allStars.forEach((s) => s.classList.remove("active"));
  });
}
