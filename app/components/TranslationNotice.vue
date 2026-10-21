<script setup lang="ts">
const { t } = useI18n()
const switchLocalePath = useSwitchLocalePath()
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
      <ULink :to="switchLocalePath('en-GB')" class="font-medium underline underline-offset-2">
        {{ t("content.machineTranslated.readOriginal") }}
      </ULink>
    </template>
  </UAlert>
</template>
