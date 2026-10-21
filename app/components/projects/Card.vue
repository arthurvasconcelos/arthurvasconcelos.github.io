<script setup lang="ts">
import type { Project } from "~/data/projects"

const { project } = defineProps<{ project: Project }>()

const { t, n } = useI18n()

const REPO_URL = `https://github.com/arthurvasconcelos/${project.repo}`

const stats = useProjectStats(project.repo)

const name = computed(() => stats.value?.name || project.name)
const description = computed(() => stats.value?.description ?? "")
const stars = computed(() => stats.value?.stars ?? 0)
const forks = computed(() => stats.value?.forks ?? 0)
const watchers = computed(() => stats.value?.watchers ?? 0)
const issues = computed(() => stats.value?.openIssues ?? 0)
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="font-space-grotesk flex items-center gap-2 text-2xl font-bold">
          <UIcon :name="project.languageIcon" class="size-6 shrink-0" />
          <ULink :href="REPO_URL" target="_blank" class="flex items-center gap-1">
            {{ name }}
            <UIcon name="i-lucide:arrow-up-right" class="size-4" />
          </ULink>
        </h2>
      </div>
    </template>

    <p v-if="description" class="mb-4 text-base text-slate-600 dark:text-slate-400">
      {{ description }}
    </p>

    <div class="mb-4 flex flex-wrap gap-2">
      <UTooltip :text="t('projects.stats.stars')" :delay-duration="0">
        <UBadge icon="mdi:star-outline" color="primary" variant="subtle" size="md">
          {{ n(stars) }}
        </UBadge>
      </UTooltip>
      <UTooltip :text="t('projects.stats.forks')" :delay-duration="0">
        <UBadge icon="mdi:source-fork" color="primary" variant="subtle" size="md">
          {{ n(forks) }}
        </UBadge>
      </UTooltip>
      <UTooltip :text="t('projects.stats.watchers')" :delay-duration="0">
        <UBadge icon="mdi:eye-outline" color="neutral" variant="subtle" size="md">
          {{ n(watchers) }}
        </UBadge>
      </UTooltip>
      <UTooltip :text="t('projects.stats.openIssues')" :delay-duration="0">
        <UBadge icon="mdi:alert-decagram-outline" color="neutral" variant="subtle" size="md">
          {{ n(issues) }}
        </UBadge>
      </UTooltip>
    </div>

    <ProjectsInstallCommand v-if="project.pkg" :pkg="project.pkg" :repo="project.repo" />

    <template v-if="project.subPackages?.length">
      <div class="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
        <h3
          class="font-space-grotesk mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
        >
          {{ t(`projects.subPackages.${project.subPackagesLabelKey ?? "default"}`) }}
        </h3>
        <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div
            v-for="pkg in project.subPackages"
            :key="pkg.id"
            class="flex flex-col gap-2 rounded-lg bg-slate-100 p-3 dark:bg-slate-800/50"
          >
            <div class="flex items-center gap-1.5">
              <UIcon :name="pkg.languageIcon" class="size-4 shrink-0" />
              <span class="text-sm font-medium">{{ pkg.language }}</span>
            </div>
            <ProjectsInstallCommand :pkg="pkg.pkg" :repo="pkg.repo" />
          </div>
        </div>
      </div>
    </template>
  </UCard>
</template>
