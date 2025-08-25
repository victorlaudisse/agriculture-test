// eslint.config.mjs
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import * as nestjs from "eslint-plugin-nestjs";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nestjsPlugin = /** @type {import("eslint").ESLint.Plugin} */ (nestjs);

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
  ...tseslint.configs.recommendedTypeChecked,

  // Regras do projeto
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      prettier: prettierPlugin,
      nest: nestjsPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.base.json"],
      },
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
