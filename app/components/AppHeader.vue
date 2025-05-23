<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Home",
      to: "/",
    },
    {
      label: "About",
      to: "/about",
    },
    {
      label: "Projects",
      to: "/projects",
    },
  ],
  [
    {
      label: "GitHub",
      icon: "i-simple-icons-github",
      to: "https://github.com/arthurvasconcelos",
      target: "_blank",
    },
  ],
]);
</script>

<template>
  <UContainer as="header" class="flex justify-between items-center">
    <div
      class="flex items-center justify-between flex-wrap w-35.5 font-raleway text-2xl"
    >
      Arthur
      <span aria-hidden="true" class="font-source font-bold">\n</span>
      Vasconcelos
    </div>

    <div class="flex gap-1.5 items-center">
      <UNavigationMenu :items="items" />
      <ColorModeButton />
    </div>
  </UContainer>
</template>
