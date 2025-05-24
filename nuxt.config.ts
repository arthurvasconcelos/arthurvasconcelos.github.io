// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  runtimeConfig: {
    // The private keys which are only available server-side
    apiSecret: "123",
    // Keys within public are also exposed client-side
    public: {
      apiBase: "/api",
    },
  },

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

  // app: {
  //   head: {
  //     title: "Arthur Vasconcelos", // default fallback title
  //     htmlAttrs: {
  //       lang: "en",
  //     },
  //     link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  //     charset: "utf-16",
  //     viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  //   },
  // },

  modules: [
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxt/ui",
    "@nuxt/fonts",
    "nuxt-lodash",
    "@vueuse/nuxt",
  ],
});
