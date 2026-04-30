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
      'dark:bg-(image:--dark-background)',
    ]"
  >
    <AppHeader />
    <slot />
  </div>
</template>
