<script setup lang="ts">
defineProps<{
  title?: string;
  caption?: string;
}>();

const { t } = useI18n();
const { showWiring } = provideLabWiring();

function toggleWiring(): void {
  showWiring.value = !showWiring.value;
}
</script>

<template>
  <div
    class="not-prose my-10 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
  >
    <div
      class="flex min-h-64 items-center justify-center overflow-hidden bg-slate-900 px-6 py-14"
    >
      <slot />
    </div>

    <div
      class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/60"
    >
      <div class="min-w-0">
        <p
          v-if="title"
          class="truncate text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          {{ title }}
        </p>
        <p v-if="caption" class="truncate text-xs text-slate-500 dark:text-slate-400">
          {{ caption }}
        </p>
      </div>

      <UButton
        size="xs"
        color="neutral"
        variant="subtle"
        :icon="showWiring ? 'i-lucide-chevron-up' : 'i-lucide-settings-2'"
        class="font-jetbrains"
        :aria-expanded="showWiring"
        @click="toggleWiring"
      >
        {{ showWiring ? t("labs.hideWiring") : t("labs.showWiring") }}
      </UButton>
    </div>
  </div>
</template>
