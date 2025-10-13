# 🪄 Guia de Desenvolvimento — Front-End

## 📌 Sumário
1. [Introdução](#-introdução)  
2. [Softwares Necessários](#-softwares-necessários)  
3. [Padrões de Código](#-padrões-de-código)  
   - [Nomenclatura](#-nomenclatura)  
   - [Formatação](#-formatação)  
   - [Estrutura de Pastas](#-estrutura-de-pastas)  
4. [Commits e Git Flow](#-commits-e-git-flow)  
5. [Organização de Tasks](#-organização-de-tasks)  
6. [Páginas e Estrutura do Projeto](#-páginas-e-estrutura-do-projeto)  
7. [Boas Práticas de Desenvolvimento](#-boas-práticas-de-desenvolvimento)

---

## 💻 Introdução

Este guia define como o time deve estruturar, escrever e manter o **código front-end** do projeto de extensão.  
A ideia é garantir:
- ✨ Clareza no código  
- 🧭 Organização da base do projeto  
- 🤝 Padronização entre todos os devs  
- 🧰 Facilidade de manutenção e expansão futura

---

## 🧰 Softwares Necessários

| Software  | Versão recomendada | Uso Principal |
|-----------|--------------------|---------------|
| [Node.js](https://nodejs.org/) | 20+ | Gerenciar dependências e Tailwind |
| [Git](https://git-scm.com/) | 2.4+ | Controle de versão |

> ⚡ **Dica:** use VSCode com extensão de Tailwind para autocomplete e formatação automática.

---

## 🪄 Padrões de Código

### 🏷️ Nomenclatura

| Elemento                  | Padrão        | Exemplo                       |
|----------------------------|---------------|-------------------------------|
| Variáveis JS               | `camelCase`   | `userName`                    |
| Funções JS                 | `camelCase`   | `getUserFeedback`             |
| Constantes JS              | `UPPER_CASE`  | `MAX_RATING`                  |
| Classes CSS/HTML           | `kebab-case`  | `feedback-container`         |
| IDs HTML                   | `kebab-case`  | `form-feedback`              |
| Arquivos e pastas          | `kebab-case`  | `feedback-form.js`           |

> 📌 **Dica:** nomes devem ser claros — evite `temp`, `data`, `coisa`.

---

### 🧹 Formatação

- Indentação: **2 espaços**
- Linha máxima: **100 caracteres**
- Espaço entre operadores:
  - ✅ `const total = a + b;`
  - ❌ `const total=a+b;`
- Funções curtas e objetivas (1 responsabilidade por função)
- Comentários explicam **por que**, não **o que**

```js
// Corrige bug de arredondamento da nota no feedback
const rating = Math.round(averageRating);
```

---

### 🧭 Estrutura de Pastas

```
/frontend
 ├── /assets
 │   ├── /img          → imagens do projeto
 │   └── /icons        → ícones em svg ou png
 │
 ├── /js               → scripts JavaScript
 │   └── main.js
 │
 ├── /styles           → configurações globais de estilo
 │   ├── tailwind.css  → conexão e import do Tailwind
 │   └── base.css      → fontes, variáveis de cor e resets
 │
 ├── /pages            → páginas internas
 │   ├── sobre.html
 │   ├── equipe.html
 │   ├── metodologia.html
 │   ├── resultados.html
 │   ├── contato.html
 │   └── feedback.html
 │
 └── index.html        → página inicial
```

> 📂 O `index.html` fica **na raiz**.  
> 🧩 O Tailwind será configurado no `tailwind.config.js` e linkado no `tailwind.css`.

---

## 🧭 Commits e Git Flow

### ✍️ Formato de Mensagens

```
[tipo]: descrição clara
```

| Tipo        | Uso                                   | Exemplo                              |
|-------------|----------------------------------------|----------------------------------------|
| feat        | Nova funcionalidade                    | `feat: adicionar formulário de feedback` |
| fix         | Correção de bug                        | `fix: corrigir responsividade da navbar` |
| style       | Ajuste visual ou de formatação         | `style: padronizar espaçamento da home` |
| docs        | Documentação                          | `docs: adicionar guia frontend` |
| chore       | Configuração ou tarefas auxiliares     | `chore: atualizar estrutura de pastas` |

👉 Commits devem ser objetivos e frequentes.  
👉 1 commit = 1 mudança.

---

### 🌿 Branches

| Branch | Função |
|--------|--------|
| `dev`  | Desenvolvimento ativo — onde todas as alterações são feitas |
| `main` | Código estável — recebe merge apenas quando testado |

> ⚠️ Não serão criadas múltiplas branches.  
> Toda codificação será feita na `dev`.  
> Quando estiver validada → merge para `main`.

---

## 📝 Organização de Tasks

Cada tarefa deve:
- Ter uma descrição clara no board do projeto (Trello, GitHub ou Docs)  
- Ser feita e testada na `dev`  
- Ter commits limpos e organizados

| Tipo de Task            | Exemplo de commit                             |
|--------------------------|-----------------------------------------------|
| Nova funcionalidade      | `feat: adicionar navbar`                     |
| Correção de bug          | `fix: corrigir erro no formulário`           |
| Ajuste de estilo         | `style: melhorar espaçamento da home`       |
| Documentação             | `docs: adicionar seção de feedback`         |

---

## 🌐 Páginas e Estrutura do Projeto

### Página Inicial (index.html)
- Nome do projeto
- Logo ou imagem representativa
- Frase de impacto (slogan)

### Sobre (`pages/sobre.html`)
- Objetivo
- Problema que resolve
- Público-alvo

### Equipe (`pages/equipe.html`)
- Foto, nome, curso e função

### Metodologia (`pages/metodologia.html`)
- Explicação simples do processo
- (Infográfico opcional)

### Resultados (`pages/resultados.html`)
- O que já foi feito
- O que se espera alcançar

### Contato & Feedback
- `pages/contato.html` → formulário com Nome, E-mail, Mensagem  
- `pages/feedback.html` → formulário com Nome, Comentário e Estrelas

---

## 🧠 Boas Práticas de Desenvolvimento

- ✅ Teste no navegador a cada alteração  
- 📱 Priorize responsividade (mobile-first)  
- 🪄 Use classes utilitárias do Tailwind de forma clara e objetiva  
- 🪞 Reaproveite componentes visuais sempre que possível  
- 🧼 Evite código duplicado — centralize funções JS em `main.js` quando possível  
- 💬 Mantenha comentários úteis e curtos  
- 🚫 Nunca suba código não testado para `main`  
- 🔁 Sempre faça `git pull dev` antes de continuar codando

---

📢 **Conclusão**  
Esse guia foi criado pra manter o **Front-end leve, padronizado e fácil de evoluir**.  
Pense nele como a base que evita gambiarras no futuro 🚀  
Se houver melhorias, proponha no repositório — o padrão também cresce junto com o projeto 💪
