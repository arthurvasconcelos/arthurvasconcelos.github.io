<script setup lang="ts">
import type { ProjectPackage } from "~/data/projects"

const { pkg, repo } = defineProps<{
  pkg: ProjectPackage
  repo: string
}>()

const { t } = useI18n()
const copied = ref(false)
const packageVersion = usePackageVersion(pkg, repo)

async function copy() {
  try {
    await navigator.clipboard.writeText(pkg.installCommand)
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
      {{ pkg.installCommand }}
    </code>
    <UTooltip v-if="packageVersion" :text="t('projects.stats.version')" :delay-duration="0">
      <span
        class="font-jetbrains shrink-0 rounded bg-slate-300/60 px-1.5 py-0.5 text-[11px] text-slate-700 dark:bg-slate-700 dark:text-slate-200"
      >
        v{{ packageVersion.version }}
      </span>
    </UTooltip>
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
