<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { t, locales, locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();

const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: t("nav.home"),
      to: localePath("/"),
    },
    {
      label: t("nav.about"),
      to: localePath("/about"),
    },
    {
      label: t("nav.projects"),
      to: localePath("/projects"),
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
    <NuxtLink
      :to="localePath('/')"
      class="flex items-center justify-between flex-wrap w-35.5 font-raleway text-2xl"
    >
      Arthur
      <span aria-hidden="true" class="font-source font-bold">\n</span>
      Vasconcelos
    </NuxtLink>

    <div class="flex gap-1.5 items-center">
      <UNavigationMenu :items="items" />
      <div class="flex items-center gap-0.5 font-source text-xs">
        <NuxtLink
          v-for="loc in locales"
          :key="loc.code"
          :to="switchLocalePath(loc.code)"
          :class="[
            'px-1.5',
            'py-0.5',
            'rounded',
            locale === loc.code
              ? 'bg-violet-500 text-white'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
          ]"
        >
          {{ loc.code.split('-')[0]?.toUpperCase() }}
        </NuxtLink>
      </div>
      <ColorModeButton />
    </div>
  </UContainer>
</template>
