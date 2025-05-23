<script setup lang="ts">
const {
  text,
  currentClass,
  capitalize = false,
  doesTransition = false,
} = defineProps<{
  text?: string;
  currentClass?: string;
  capitalize?: boolean;
  doesTransition?: boolean;
}>();
</script>

<template>
  <span
    :class="[
      // text
      { capitalize: capitalize },
      'font-source',
      'font-bold',
      // spacing
      'py-1.5',
      'px-2.5',
      // effects
      { 'transition-[background-color]': doesTransition },
      'duration-[0.5s]',
      'ease-out',
      // custom
      currentClass,
    ]"
    :data-text="text"
  >
    <template v-if="text">
      {{ text }}
    </template>
    <template v-else>
      <slot />
    </template>
  </span>
</template>
