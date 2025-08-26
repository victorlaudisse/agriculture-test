// eslint.config.mjs
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import * as nestjs from "eslint-plugin-nestjs";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nestjsPlugin = /** @type {import("eslint").ESLint.Plugin} */ (nestjs);

export default [
  // Ignorar gerados + o próprio config
  {
    ignores: [
      "eslint.config.mjs",
      "node_modules",
      "dist",
      "coverage",
      ".next",
      "apps/backend/dist",
      "apps/backend/generated",
      "apps/frontend/.next",
    ],
  },

  // Base JS (apenas para .js/.mjs/.cjs)
  {
    files: ["**/*.{js,mjs,cjs}"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
  },

  // Regras globais do projeto (neutras)
  {
    plugins: {
      import: importPlugin,
      "unused-imports": unusedImports,
      prettier: prettierPlugin,
      nest: nestjsPlugin,
    },
    rules: {
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

  // BACKEND (TS de produção) — com type-check
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ["apps/backend/src/**/*.{ts,tsx}"],
    languageOptions: {
      ...(cfg.languageOptions ?? {}),
      parserOptions: {
        ...(cfg.languageOptions?.parserOptions ?? {}),
        tsconfigRootDir: __dirname,
        project: ["./apps/backend/tsconfig.json"],
      },
      globals: { ...globals.node },
    },
  })),
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["apps/backend/src/**/*.{ts,tsx}"],
    languageOptions: {
      ...(cfg.languageOptions ?? {}),
      parserOptions: {
        ...(cfg.languageOptions?.parserOptions ?? {}),
        tsconfigRootDir: __dirname,
        project: ["./apps/backend/tsconfig.json"],
      },
      globals: { ...globals.node },
    },
  })),

  // BACKEND (tests) — com tsconfig + jest globals
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ["apps/backend/**/*.{spec,test}.{ts,tsx}"],
    plugins: { ...(cfg.plugins ?? {}), jest: jestPlugin },
    languageOptions: {
      ...(cfg.languageOptions ?? {}),
      parserOptions: {
        ...(cfg.languageOptions?.parserOptions ?? {}),
        tsconfigRootDir: __dirname,
        project: ["./apps/backend/tsconfig.json"],
      },
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      ...(cfg.rules ?? {}),
      "@typescript-eslint/unbound-method": "off",
      "jest/unbound-method": "error",
    },
  })),
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["apps/backend/**/*.{spec,test}.{ts,tsx}"],
    plugins: { ...(cfg.plugins ?? {}), jest: jestPlugin },
    languageOptions: {
      ...(cfg.languageOptions ?? {}),
      parserOptions: {
        ...(cfg.languageOptions?.parserOptions ?? {}),
        tsconfigRootDir: __dirname,
        project: ["./apps/backend/tsconfig.json"],
      },
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      ...(cfg.rules ?? {}),
      "@typescript-eslint/unbound-method": "off",
      "jest/unbound-method": "error",
    },
  })),

  // BACKEND (E2E tests) — com tsconfig + jest globals
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ["apps/backend/test/**/*.e2e-spec.ts"],
    plugins: { ...(cfg.plugins ?? {}), jest: jestPlugin },
    languageOptions: {
      ...(cfg.languageOptions ?? {}),
      parserOptions: {
        ...(cfg.languageOptions?.parserOptions ?? {}),
        tsconfigRootDir: __dirname,
        project: ["./apps/backend/tsconfig.json"],
      },
      globals: { ...globals.node, ...globals.jest },
    },
  })),
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["apps/backend/test/**/*.e2e-spec.ts"],
    plugins: { ...(cfg.plugins ?? {}), jest: jestPlugin },
    languageOptions: {
      ...(cfg.languageOptions ?? {}),
      parserOptions: {
        ...(cfg.languageOptions?.parserOptions ?? {}),
        tsconfigRootDir: __dirname,
        project: ["./apps/backend/tsconfig.json"],
      },
      globals: { ...globals.node, ...globals.jest },
    },
  })),

  // FRONTEND (TS) — se/quando usar
  ...tseslint.configs.recommended.map((cfg) => ({
    ...cfg,
    files: ["apps/frontend/**/*.{ts,tsx}"],
    languageOptions: {
      ...(cfg.languageOptions ?? {}),
      parserOptions: {
        ...(cfg.languageOptions?.parserOptions ?? {}),
        tsconfigRootDir: __dirname,
        project: ["./apps/frontend/tsconfig.json"],
      },
      globals: { ...globals.browser, ...globals.node },
    },
  })),
  ...tseslint.configs.recommendedTypeChecked.map((cfg) => ({
    ...cfg,
    files: ["apps/frontend/**/*.{ts,tsx}"],
    languageOptions: {
      ...(cfg.languageOptions ?? {}),
      parserOptions: {
        ...(cfg.languageOptions?.parserOptions ?? {}),
        tsconfigRootDir: __dirname,
        project: ["./apps/frontend/tsconfig.json"],
      },
      globals: { ...globals.browser, ...globals.node },
    },
  })),

  // Desabilita conflitos com Prettier
  eslintConfigPrettier,
];
