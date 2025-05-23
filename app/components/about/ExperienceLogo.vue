<script setup lang="ts">
defineProps<{
  experience: WorkExperience;
}>();
</script>

<template>
  <div
    :class="[
      // Flex
      'shrink-0',
      // Sizing
      'w-25',
      'h-25',
      // Border
      'border-2',
      'border-slate-700',
      'dark:border-slate-200',
      'rounded-full',
      // Background
      'bg-slate-950',
      'dark:bg-slate-50',
      // Content
      'overflow-hidden',
      // Spacing
      'group-odd/experience:ml-4',
      'group-even/experience:mr-4',
    ]"
  >
    <img
      v-if="experience.companyLogo"
      :src="experience.companyLogo"
      :alt="experience.company"
    />
    <PlaceholderBox v-else class="w-full h-full bg-white dark:bg-black" />
  </div>
</template>
