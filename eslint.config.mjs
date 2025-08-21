// eslint.config.mjs
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default [
  // Ignorar pastas geradas
  {
    ignores: [
      "node_modules",
      "dist",
      "coverage",
      ".next",
      "apps/backend/dist",
      "apps/frontend/.next",
    ],
  },

  // JS base
  js.configs.recommended,

  // TypeScript (sem type-check por enquanto)
  ...tseslint.configs.recommended,

  // Regras do projeto
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      prettier: prettierPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    rules: {
      // mantém o que você tinha no .eslintrc
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "unused-imports/no-unused-imports": "warn",
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"],
          ],
        },
      ],
    },
  },

  // Desliga conflitos com Prettier
  eslintConfigPrettier,
];
