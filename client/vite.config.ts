import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  base: "/",
  plugins: [tailwindcss(), react()],
  fmt: {
    ignorePatterns: ["dist/**", "package-lock.json"],
  },
  lint: {
    plugins: ["oxc", "typescript", "unicorn", "react"],
    categories: {
      correctness: "error",
    },
    env: {
      builtin: true,
      browser: true,
      es2020: true,
    },
    ignorePatterns: ["dist/**", "package-lock.json"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "react/rules-of-hooks": "error",
      "react/exhaustive-deps": "warn",
      "react/set-state-in-effect": "error",
      "react/only-export-components": [
        "error",
        {
          allowConstantExport: true,
        },
      ],
    },
    overrides: [
      {
        files: ["scripts/**/*.js"],
        env: {
          node: true,
        },
      },
    ],
  },
});
