import { defineConfig } from "eslint/config";
import airbnb from "eslint-config-airbnb";
import react from 'eslint-plugin-react'
import jest from 'eslint-plugin-jest'
import reactHooks from 'eslint-plugin-react-hooks'
import _import from 'eslint-plugin-import'

export default defineConfig([
  {
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
