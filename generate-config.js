require("dotenv").config();
const fs = require("fs");
const path = require("path");

const API_URL = process.env.API_URL;

if (!API_URL) {
  console.error("❌ ERRO: API_URL não encontrada!");
  console.error("Configure a variável API_URL no Vercel: Settings → Environment Variables");
  process.exit(1);
}

console.log("✅ API_URL encontrada:", API_URL);

const configContent = `export const API_URL = "${API_URL}";
`;

const configPath = path.join(__dirname, "src", "js", "config.js");

fs.writeFileSync(configPath, configContent, "utf8");
console.log("✅ config.js gerado com sucesso em:", configPath);
