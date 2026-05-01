// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  site: {
    url: "https://arthurvasconcelos.com.br",
    name: "Arthur Vasconcelos",
  },

  css: ["~/assets/css/main.css"],

  icon: {
    mode: "css",
    cssLayer: "base",
  },

  fonts: {
    families: [
      { name: "Space Grotesk", global: true, provider: "google", weights: [400, 600, 700] },
      { name: "JetBrains Mono", global: true, provider: "google", weights: [400, 700] },
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
    "@nuxtjs/sitemap",
    "@nuxt/content",
  ],

  content: {
    highlight: {
      theme: {
        default: "github-light",
        dark: "tokyo-night",
      },
      langs: [
        "typescript",
        "javascript",
        "vue",
        "bash",
        "shell",
        "python",
        "go",
        "json",
        "yaml",
        "html",
        "css",
        "markdown",
      ],
    },
  },

  nitro: {
    prerender: {
      routes: ["/rss.xml", "/pt-br/rss.xml", "/sv/rss.xml"],
    },
  },

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
