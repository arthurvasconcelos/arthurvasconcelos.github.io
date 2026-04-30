// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  css: ["~/assets/css/main.css"],

  icon: {
    mode: "css",
    cssLayer: "base",
  },

  fonts: {
    families: [
      { name: "Raleway", global: true, provider: "google" },
      { name: "Slabo 27px", global: true, provider: "google" },
      { name: "Source Code Pro", global: true, provider: "google" },
    ],
  },

  colorMode: {
    classPrefix: "",
    classSuffix: "",
  },

  modules: [
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxt/ui",
    "@nuxt/fonts",
    "nuxt-lodash",
    "@vueuse/nuxt",
    "@nuxt/eslint",
    "@nuxtjs/i18n",
  ],

  i18n: {
    defaultLocale: "en-GB",
    langDir: "locales",
    locales: [
      { code: "en-GB", language: "en-GB", name: "English", file: "en-GB.ts" },
      { code: "pt-BR", language: "pt-BR", name: "Português", file: "pt-BR.ts" },
      { code: "sv", language: "sv-SE", name: "Svenska", file: "sv.ts" },
    ],
    strategy: "prefix_except_default",
    lazy: true,
    bundle: {
      optimizeTranslationDirective: false,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },
});
