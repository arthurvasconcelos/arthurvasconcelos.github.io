<script setup lang="ts">
defineProps<{ originalPath: string }>()

const { t } = useI18n()
</script>

<template>
  <UAlert
    icon="i-lucide:languages"
    color="neutral"
    variant="subtle"
    :title="t('content.machineTranslated.title')"
  >
    <template #description>
      {{ t("content.machineTranslated.description") }}
      <ULink :to="originalPath" locale="en-GB" class="font-medium underline underline-offset-2">
        {{ t("content.machineTranslated.readOriginal") }}
      </ULink>
    </template>
  </UAlert>
</template>
