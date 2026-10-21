<script setup lang="ts">
import type { Project } from "~/data/projects"

const { project } = defineProps<{ project: Project }>()

const { t, n } = useI18n()

const REPO_URL = `https://github.com/arthurvasconcelos/${project.repo}`

const stats = useProjectStats(project.repo, { npmCreateDate: project.npmCreateDate })

const name = computed(() => stats.value?.name || project.name)
const archived = computed(() => stats.value?.archived ?? false)
const description = computed(() => stats.value?.description ?? "")
const watchers = computed(() => stats.value?.watchers ?? 0)
const stars = computed(() => stats.value?.stars ?? 0)
const forks = computed(() => stats.value?.forks ?? 0)
const issues = computed(() => stats.value?.openIssues ?? 0)
const downloads = computed(() => stats.value?.downloads ?? 0)
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-space-grotesk flex items-center justify-between text-2xl font-bold">
        <ULink
          :href="REPO_URL"
          target="_blank"
          class="inline-flex items-center gap-1 text-slate-900 transition-colors hover:text-violet-600 dark:text-slate-100 dark:hover:text-violet-400"
        >
          {{ name }}
          <UIcon name="i-lucide:arrow-up-right" class="size-5 shrink-0" />
        </ULink>
        <UBadge
          v-if="archived"
          icon="mdi:archive-outline"
          size="lg"
          color="neutral"
          variant="subtle"
        >
          {{ t("projects.archived") }}
        </UBadge>
      </h2>
    </template>

    <p v-if="description" class="mb-6 text-base text-[#475569] dark:text-slate-300">
      {{ description }}
    </p>

    <div class="flex flex-wrap gap-2">
      <UTooltip :delay-duration="0" :text="t('projects.stats.watchers')">
        <span class="stat-badge">
          <UIcon name="mdi:eye-outline" class="size-4 shrink-0" />
          {{ n(watchers) }}
        </span>
      </UTooltip>

      <UTooltip :delay-duration="0" :text="t('projects.stats.stars')">
        <span class="stat-badge">
          <UIcon name="mdi:star-outline" class="size-4 shrink-0" />
          {{ n(stars) }}
        </span>
      </UTooltip>

      <UTooltip :delay-duration="0" :text="t('projects.stats.forks')">
        <span class="stat-badge">
          <UIcon name="mdi:source-fork" class="size-4 shrink-0" />
          {{ n(forks) }}
        </span>
      </UTooltip>

      <UTooltip :delay-duration="0" :text="t('projects.stats.issues')">
        <span class="stat-badge">
          <UIcon name="mdi:alert-decagram-outline" class="size-4 shrink-0" />
          {{ n(issues) }}
        </span>
      </UTooltip>

      <UTooltip :delay-duration="0" :text="t('projects.stats.downloads')">
        <span class="stat-badge">
          <UIcon name="mdi:cloud-download-outline" class="size-4 shrink-0" />
          {{ n(downloads) }}
        </span>
      </UTooltip>
    </div>

    <template #footer>
      <ProjectsInstallCommand v-if="project.pkg" :pkg="project.pkg" :repo="project.repo" />
    </template>
  </UCard>
</template>

<style scoped>
.stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  /* #475569 on any light bg gives ~7:1 contrast */
  background-color: #f1f5f9;
  color: #475569;
  box-shadow: inset 0 0 0 1px #cbd5e1;
}

.dark .stat-badge {
  /* #e2e8f0 on #1e293b gives ~9:1 contrast */
  background-color: #1e293b;
  color: #e2e8f0;
  box-shadow: inset 0 0 0 1px #334155;
}
</style>
