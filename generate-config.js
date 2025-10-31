require("dotenv").config();
const fs = require("fs");
const path = require("path");

const API_URL = process.env.API_URL;

const configContent = `export const API_URL = "${API_URL}";
`;

const configPath = path.join(__dirname, "src", "js", "config.js");

fs.writeFileSync(configPath, configContent, "utf8");
