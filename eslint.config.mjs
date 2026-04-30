// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import tsParser from "@typescript-eslint/parser";

export default withNuxt({
  files: ["**/*.vue"],
  languageOptions: {
    parserOptions: {
      parser: tsParser,
    },
  },
});
