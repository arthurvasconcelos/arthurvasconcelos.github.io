<script setup lang="ts">
const { command } = defineProps<{
  command: string
}>()

const { t } = useI18n()
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(command)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Clipboard API unavailable (e.g. non-secure context)
  }
}
</script>

<template>
  <div class="flex items-center gap-2 rounded-md bg-slate-200 py-1 pr-1 pl-2 dark:bg-slate-800">
    <code
      class="font-jetbrains grow text-xs break-all whitespace-pre-wrap text-slate-800 dark:text-slate-300"
    >
      {{ command }}
    </code>
    <UTooltip :text="copied ? t('projects.copied') : t('projects.copy')" :delay-duration="0">
      <UButton
        :icon="copied ? 'i-material-symbols-check' : 'i-material-symbols-content-copy-outline'"
        :aria-label="copied ? t('projects.copied') : t('projects.copy')"
        :color="copied ? 'secondary' : 'neutral'"
        variant="ghost"
        size="xs"
        @click="copy"
      />
    </UTooltip>
  </div>
</template>
