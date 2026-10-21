<script setup lang="ts">
import type { WorkExperience } from "~/composables/useWorkExperience"

defineProps<{
  experience: WorkExperience
}>()
</script>

<template>
  <div
    :class="[
      // Sizing
      'size-14',
      'sm:size-16',
      // Border
      'border-2',
      'border-slate-300',
      'dark:border-slate-700',
      'rounded-full',
      // Background
      'bg-white',
      'dark:bg-slate-950',
      // Content
      'overflow-hidden',
    ]"
  >
    <img
      v-if="experience.companyLogo"
      :src="experience.companyLogo"
      :alt="experience.company"
      class="h-full w-full object-contain"
    >
    <PlaceholderBox v-else class="h-full w-full rounded-full" />
  </div>
</template>
