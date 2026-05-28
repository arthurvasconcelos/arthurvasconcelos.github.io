<template>
  <div class="not-prose group relative my-6 overflow-hidden rounded-lg ring-1 ring-slate-200 dark:ring-slate-700/50">
    <div
      class="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-700/50 dark:bg-slate-800/80"
    >
      <span class="select-none font-jetbrains text-xs text-slate-500 dark:text-slate-400">
        {{ filename ?? language ?? 'code' }}
      </span>
      <button
        type="button"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        class="ml-auto flex cursor-pointer items-center gap-1.5 rounded px-2 py-1 text-xs font-jetbrains text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
        @click="copyCode"
      >
        <UIcon
          :name="copied ? 'i-material-symbols-check' : 'i-material-symbols-content-copy-outline'"
          class="size-3.5"
        />
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
    <!-- v-bind="$attrs" passes Shiki's inline style (background-color + CSS vars) to the pre element -->
    <pre v-bind="$attrs" :class="[$props.class, 'm-0 overflow-x-auto p-4 font-jetbrains text-sm leading-relaxed']"><slot /></pre>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  meta?: string
  class?: string
}>()

const copied = ref(false)

async function copyCode() {
  if (!props.code) return
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // Clipboard API unavailable (e.g. non-secure context)
  }
}
</script>
