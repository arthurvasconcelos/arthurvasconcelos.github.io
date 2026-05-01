<script setup lang="ts">
import axe from "axe-core";
import type { Result } from "axe-core";

const isDev = import.meta.dev;

const running = ref(false);
const violations = ref<Result[]>([]);
const done = ref(false);
const panelOpen = ref(false);
const expanded = ref(new Set<string>());
const copiedId = ref<string | null>(null);

const IMPACT_ORDER: Record<string, number> = { critical: 0, serious: 1, moderate: 2, minor: 3 };
const IMPACT_COLOR: Record<string, "error" | "warning" | "info" | "neutral"> = {
  critical: "error",
  serious: "warning",
  moderate: "info",
  minor: "neutral",
};

async function runAudit() {
  running.value = true;
  done.value = false;
  panelOpen.value = false;
  violations.value = [];
  expanded.value = new Set();
  try {
    const { violations: vs } = await axe.run();
    violations.value = [...vs].sort(
      (a, b) =>
        (IMPACT_ORDER[a.impact ?? "minor"] ?? 3) -
        (IMPACT_ORDER[b.impact ?? "minor"] ?? 3),
    );
    done.value = true;
    if (violations.value.length) panelOpen.value = true;
  } finally {
    running.value = false;
  }
}

function toggleViolation(id: string) {
  if (expanded.value.has(id)) expanded.value.delete(id);
  else expanded.value.add(id);
}

function formatViolations(vs: Result[]): string {
  return vs
    .map((v) => {
      const nodes = v.nodes
        .map((n) => {
          const lines = ["```html", n.html, "```"];
          if (n.failureSummary) lines.push(`*Failure:* ${n.failureSummary}`);
          return lines.join("\n");
        })
        .join("\n");
      return [
        "---",
        `### [${(v.impact ?? "minor").toUpperCase()}] ${v.id}`,
        `**Help:** ${v.help}`,
        `**Description:** ${v.description}`,
        `**Affected elements (${v.nodes.length}):**`,
        nodes,
        `**More info:** ${v.helpUrl}`,
      ].join("\n");
    })
    .join("\n\n");
}

async function copy(vs: Result[], trackId: string) {
  const header =
    trackId === "__all__"
      ? `# A11y Audit — ${location.pathname} — ${new Date().toISOString()}\n## ${vs.length === 0 ? "No violations ✓" : `${vs.length} violation(s)`}\n\n`
      : "";
  await navigator.clipboard.writeText(header + formatViolations(vs));
  copiedId.value = trackId;
  setTimeout(() => (copiedId.value = null), 2000);
}

if (isDev) {
  const router = useRouter();
  let timer: ReturnType<typeof setTimeout>;

  const scheduleRun = () => {
    clearTimeout(timer);
    done.value = false;
    violations.value = [];
    panelOpen.value = false;
    timer = setTimeout(runAudit, 1000);
  };

  onMounted(scheduleRun);
  router.afterEach(scheduleRun);
}
</script>

<template>
  <div
    v-if="isDev"
    class="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2 font-space-grotesk"
  >
    <!-- Results panel -->
    <div
      v-if="done && panelOpen"
      class="flex w-[min(520px,calc(100vw-2rem))] max-h-[70vh] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      role="region"
      aria-label="A11y audit results"
    >
      <!-- Toolbar -->
      <div
        class="flex shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
      >
        <span class="flex-1 text-xs font-semibold">
          A11y —
          <span
            v-if="violations.length"
            class="text-red-600 dark:text-red-400"
          >{{ violations.length }} violation{{ violations.length > 1 ? "s" : "" }}</span>
          <span v-else class="text-emerald-600 dark:text-emerald-400">all clear ✓</span>
        </span>
        <UButton
          :icon="copiedId === '__all__' ? 'i-lucide-check' : 'i-lucide-copy'"
          :label="copiedId === '__all__' ? 'Copied!' : 'Copy all'"
          color="neutral"
          variant="outline"
          size="xs"
          @click="copy(violations, '__all__')"
        />
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Close panel"
          @click="panelOpen = false"
        />
      </div>

      <!-- Scrollable content -->
      <div class="overflow-y-auto">
        <div
          v-if="!violations.length"
          class="flex items-center gap-2 px-3 py-4 text-xs font-medium text-emerald-600 dark:text-emerald-400"
        >
          <UIcon name="i-lucide-check-circle" class="size-4 shrink-0" />
          No accessibility violations found on this page.
        </div>

        <ul v-else class="flex flex-col gap-1 p-2">
          <li
            v-for="v in violations"
            :key="v.id"
            class="overflow-hidden rounded border border-slate-200 dark:border-slate-700"
          >
            <div class="flex items-stretch">
              <button
                class="flex flex-1 items-center gap-2 px-2.5 py-2 text-left text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                @click="toggleViolation(v.id)"
              >
                <UBadge
                  :label="(v.impact ?? 'minor').toUpperCase()"
                  :color="IMPACT_COLOR[v.impact ?? 'minor']"
                  variant="subtle"
                  size="xs"
                  class="shrink-0 font-jetbrains"
                />
                <span class="flex-1 font-medium leading-snug">{{ v.help }}</span>
                <span class="shrink-0 font-jetbrains text-slate-400">
                  {{ v.nodes.length }}
                  <UIcon
                    :name="expanded.has(v.id) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                    class="inline size-3"
                  />
                </span>
              </button>
              <button
                class="flex shrink-0 items-center border-l border-slate-200 px-2.5 text-slate-400 hover:text-slate-700 dark:border-slate-700 dark:hover:text-slate-200"
                :aria-label="`Copy ${v.id}`"
                @click="copy([v], v.id)"
              >
                <UIcon
                  :name="copiedId === v.id ? 'i-lucide-check' : 'i-lucide-copy'"
                  class="size-3.5"
                />
              </button>
            </div>

            <div
              v-if="expanded.has(v.id)"
              class="flex flex-col gap-2 border-t border-slate-200 px-2.5 py-2 dark:border-slate-700"
            >
              <p class="text-xs text-slate-500 dark:text-slate-400">{{ v.description }}</p>
              <div class="flex flex-col gap-1">
                <code
                  v-for="(node, i) in v.nodes"
                  :key="i"
                  class="block whitespace-pre-wrap break-all rounded bg-slate-100 px-2 py-1 font-jetbrains text-[0.65rem] leading-relaxed text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >{{ node.html.slice(0, 200) }}</code>
              </div>
              <a
                :href="v.helpUrl"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1 text-xs text-violet-500 hover:underline"
              >
                <UIcon name="i-lucide-external-link" class="size-3" />
                How to fix
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Floating trigger row -->
    <div class="flex items-center gap-1.5">
      <button
        v-if="done"
        class="inline-flex cursor-pointer items-center gap-1 rounded-full border-0 px-2.5 py-1 font-space-grotesk text-[0.7rem] font-semibold"
        :class="
          violations.length === 0
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
        "
        :aria-label="`${violations.length === 0 ? 'No violations' : `${violations.length} violations`} — toggle panel`"
        @click="panelOpen = !panelOpen"
      >
        <UIcon
          :name="violations.length === 0 ? 'i-lucide-check-circle' : 'i-lucide-x-circle'"
          class="size-3.5"
        />
        {{ violations.length === 0 ? "Pass" : violations.length }}
        <UIcon
          :name="panelOpen ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          class="size-3"
        />
      </button>

      <UButton
        :icon="running ? 'i-lucide-loader' : 'i-lucide-shield'"
        label="A11y"
        color="neutral"
        variant="soft"
        size="xs"
        :loading="running"
        aria-label="Run accessibility audit"
        @click="runAudit"
      />
    </div>
  </div>
</template>
