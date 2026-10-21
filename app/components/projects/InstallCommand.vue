<script setup lang="ts">
import type { ProjectPackage } from "~/data/projects"

const { pkg, repo } = defineProps<{
  pkg: ProjectPackage
  repo: string
}>()

const { t } = useI18n()
const copied = ref(false)
const packageVersion = usePackageVersion(pkg, repo)

const scroller = useTemplateRef<HTMLElement>("scroller")
const overflowing = ref(false)
const clippedRight = ref(false)

function measure() {
  const el = scroller.value
  if (!el) return
  overflowing.value = el.scrollWidth > el.clientWidth + 1
  clippedRight.value = overflowing.value && el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

useResizeObserver(scroller, measure)
onMounted(measure)

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
    <div
      ref="scroller"
      class="scroller min-w-0 grow overflow-x-auto"
      :class="{ 'scroller--clipped': clippedRight }"
      :tabindex="overflowing ? 0 : undefined"
      :role="overflowing ? 'group' : undefined"
      :aria-label="overflowing ? t('projects.installCommand', { name: pkg.name }) : undefined"
      @scroll.passive="measure"
    >
      <code class="font-jetbrains text-xs whitespace-nowrap text-slate-800 dark:text-slate-300">
        {{ pkg.installCommand }}
      </code>
    </div>
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

<style scoped>
.scroller {
  scrollbar-width: none;
  padding-block: 0.125rem;
  border-radius: 0.25rem;
}

.scroller::-webkit-scrollbar {
  display: none;
}

.scroller:focus-visible {
  outline: 2px solid var(--ui-primary);
  outline-offset: 2px;
}

.scroller--clipped {
  mask-image: linear-gradient(to right, black calc(100% - 2.5rem), transparent);
}
</style>
