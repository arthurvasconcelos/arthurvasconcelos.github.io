<script setup lang="ts">
defineProps<{ translations: ContentTranslation[] }>()
const { t } = useI18n()
</script>

<template>
  <div v-if="translations.length" class="flex flex-wrap items-center gap-2 text-sm text-slate-500">
    <span>{{ t("content.alsoAvailableIn") }}</span>
    <NuxtLink
      v-for="tr in translations"
      :key="tr.path"
      :to="tr.to"
      class="text-violet-500 transition-colors hover:text-violet-400"
    >
      {{ tr.name }}
    </NuxtLink>
  </div>
</template>
