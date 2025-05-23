<script setup lang="ts">
const colorMode = useColorMode();
</script>

<template>
  <div
    :class="[
      // Layout
      'flex',
      'flex-col',

      // Sizing
      'w-screen',
      'min-h-screen',

      // Color Mode
      'bg-(image:--light-background)',
      // 'dark:bg-[radial-gradient(ellipse_at_bottom,#1b2735_0%,#090a0f_70%)]',
      // 'dark:bg-radial-(--dark-background)',
      'dark:bg-(image:--dark-background)',
    ]"
  >
    <AppHeader />
    <slot />
    <!-- <AppFooter /> -->
  </div>
</template>

<style></style>
