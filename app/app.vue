<script setup lang="ts">
useHead({
  title: "Arthur Vasconcelos",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "Arthur Vasconcelos — Senior Front-End Engineer" },
  ],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  title: "Arthur Vasconcelos",
  ogTitle: "Arthur Vasconcelos",
  description: "Arthur Vasconcelos — Senior Front-End Engineer",
  ogDescription: "Arthur Vasconcelos — Senior Front-End Engineer",
  twitterCard: "summary",
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
