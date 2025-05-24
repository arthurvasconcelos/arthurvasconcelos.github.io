<script lang="ts" setup>
const {
  icon,
  name,
  level: levelProp,
} = defineProps<{
  icon: string;
  name: string;
  level: number;
}>();

const level = ref(levelProp);
</script>

<template>
  <div
    :class="[
      // Flex
      'flex',
      'items-center',
      'gap-2',
      // Colors
      'text-neutral-200',
      'bg-slate-700',
      'dark:text-neutral-700',
      'dark:bg-slate-200',
      // Border
      'border',
      'rounded-l-3xl',
      'rounded-r-2xl',
      // Spacing
      'p-1',
      'pr-2.5',
    ]"
  >
    <!-- <ClientOnly> -->
    <UAvatar :icon="icon" size="md" />
    <div class="flex flex-col gap-1 grow">
      <p class="font-source text-sm font-bold">{{ name }}</p>
      <UProgress v-model="level" />
    </div>

    <!-- <template #fallback>
        <USkeleton class="h-8 w-8 rounded-full" />
        <div class="flex flex-col gap-1 grow">
          <USkeleton class="h-5 w-full" />
          <USkeleton class="h-2 w-full" />
        </div>
      </template>
    </ClientOnly> -->
  </div>
</template>

<style>
meter {
  width: 100%;
}

meter::-webkit-meter-bar {
  background-color: var(--color-red-400);
}
</style>
