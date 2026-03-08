import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node  // ← this tells ESLint that process, __dirname, etc. exist
      }
    }
  }
];