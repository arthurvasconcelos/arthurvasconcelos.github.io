<script setup lang="ts">
defineProps<{
  experience: WorkExperience;
}>();
</script>

<template>
  <div
    :class="[
      // Sizing
      'max-w-121.5',
      // Flex
      'flex',
      'flex-col',
      'grow',
      // Colors
      'text-neutral-200',
      'bg-slate-700',
      'dark:text-neutral-700',
      'dark:bg-slate-200',
      // Border
      'group-odd/experience:rounded-l-2xl',
      'group-even/experience:rounded-r-2xl',
    ]"
  >
    <div
      :class="[
        // Flex
        'flex',
        'flex-col',
        // Spacing
        'py-2',
        'px-2',
        'group-odd/experience:pl-4',
        'group-even/experience:pr-4',
      ]"
    >
      <h3 class="flex items-center gap-1 text-lg font-semibold font-raleway">
        {{ experience.title }}
        <UIcon name="mdi:at" />
        {{ experience.company }}
      </h3>
      <p class="flex items-center gap-1 text-sm font-raleway">
        <UIcon :name="experience.locationIcon" />
        {{ experience.location }}
        <UIcon name="mdi:circle-medium" />
        {{ experience.locationType }}
        <UIcon name="mdi:circle-medium" />
        {{ experience.duration }}
      </p>
    </div>

    <div class="w-full h-0.5 bg-slate-950 dark:bg-slate-50" />

    <p
      :class="[
        // Text
        'font-slabo',
        // Spacing
        'py-2',
        'px-2',
        'group-odd/experience:pl-4',
        'group-even/experience:pr-4',
      ]"
    >
      {{ experience.description }}
    </p>
  </div>
</template>
