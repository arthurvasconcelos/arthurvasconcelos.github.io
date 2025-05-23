<script setup lang="ts">
defineProps<{
  experience: WorkExperience;
}>();
</script>

<template>
  <div
    :class="[
      // Flex
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'shrink-0',
      // Colors
      'text-neutral-200',
      'bg-slate-950',
      'dark:text-neutral-700',
      'dark:bg-slate-50',
      // Spacing
      'p-4',
      // Border
      'group-odd/experience:rounded-r-4xl',
      'group-even/experience:rounded-l-4xl',
      // Text
      'font-source',
    ]"
  >
    <span>{{ experience.start }}</span>
    <UIcon name="mdi:tilde" />
    <span>{{ experience.end }}</span>
  </div>
</template>
