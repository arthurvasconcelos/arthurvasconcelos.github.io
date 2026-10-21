<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const { t, locales, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

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
    {
      label: t("nav.blog"),
      to: localePath("/blog"),
    },
    {
      label: t("nav.labs"),
      to: localePath("/labs"),
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
])
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-slate-300/60 bg-slate-100/70 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/70"
  >
    <UContainer class="flex items-center justify-between">
      <NuxtLink
        :to="localePath('/')"
        class="font-space-grotesk flex w-35.5 flex-wrap items-center justify-between text-2xl"
      >
        Arthur
        <span aria-hidden="true" class="font-jetbrains font-bold">\n</span>
        Vasconcelos
      </NuxtLink>

      <div class="flex items-center gap-1.5">
        <UNavigationMenu :items="items" />
        <div class="font-jetbrains flex items-center gap-0.5 text-xs">
          <NuxtLink
            v-for="loc in locales"
            :key="loc.code"
            :to="switchLocalePath(loc.code)"
            :class="[
              'px-1.5',
              'py-0.5',
              'rounded',
              locale === loc.code
                ? 'bg-violet-600 text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200',
            ]"
          >
            {{ loc.code.split("-")[0]?.toUpperCase() }}
          </NuxtLink>
        </div>
        <ColorModeButton />
      </div>
    </UContainer>
  </header>
</template>
