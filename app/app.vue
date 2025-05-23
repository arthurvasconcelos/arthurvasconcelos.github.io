<script setup lang="ts">
const colorMode = useColorMode();
console.log("app.vue:", colorMode);

// const color = computed(() =>
//   colorMode.value === "dark" ? "#020618" : "white"
// );

useHead({
  title: "Arthur Vasconcelos",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    // { key: "theme-color", name: "theme-color", content: color },
    { name: "description", content: "Arthur Vasconcelos Dev" },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
  // bodyAttrs: {
  //   class: "min-h-full",
  // },
  // script: [{ innerHTML: "console.log('Hello world')" }],
});

useSeoMeta({
  title: "Arthur Vasconcelos",
  ogTitle: "Arthur Vasconcelos",
  description: "Arthur Vasconcelos Dev",
  ogDescription: "Arthur Vasconcelos Dev",
  ogImage: "https://example.com/image.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <main class="flex grow">
        <NuxtPage />
      </main>
    </NuxtLayout>
  </UApp>
</template>
