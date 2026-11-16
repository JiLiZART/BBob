import { defineConfig } from "eslint/config";
import globals from "globals";
import airbnb from "eslint-config-airbnb";
import react from 'eslint-plugin-react'
import jest from 'eslint-plugin-jest'
import reactHooks from 'eslint-plugin-react-hooks'
import _import from 'eslint-plugin-import'

export default defineConfig([
  // flat config ignores .eslintignore files; keep build output out of lint
  { ignores: ["**/dist/**", "**/es/**", "**/lib/**", "**/types/**", "**/coverage/**"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    files: ["**/*.js"],
    plugins: {
      jest,
      airbnb,
      react,
      reactHooks,
      import: _import,
    },
  },
]);
