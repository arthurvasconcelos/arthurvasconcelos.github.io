<script setup lang="ts">
import type { Project } from "~/data/projects"
import type { Endpoints } from "@octokit/types"

type UserRepoResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"]

const { project } = defineProps<{ project: Project }>()

const REPO_URL = `https://github.com/arthurvasconcelos/${project.repo}`
const GITHUB_ENDPOINT = `https://api.github.com/repos/arthurvasconcelos/${project.repo}`

const { status, data: ghData } = useFetch<UserRepoResponse>(GITHUB_ENDPOINT, { lazy: true })

const isLoading = computed(() => status.value === "pending")
const name = computed(() => ghData.value?.name || project.name)
const description = computed(() => ghData.value?.description || "")
const stars = computed(() => ghData.value?.stargazers_count ?? 0)
const forks = computed(() => ghData.value?.forks_count ?? 0)
const watchers = computed(() => ghData.value?.subscribers_count ?? 0)
const issues = computed(() => ghData.value?.open_issues_count ?? 0)
</script>

<template>
  <UCard>
    <template #header>
      <USkeleton v-if="isLoading" class="h-6 w-48" />
      <div v-else class="flex items-center justify-between">
        <h2 class="font-space-grotesk flex items-center gap-2 text-2xl font-bold">
          <UIcon :name="project.languageIcon" class="size-6 shrink-0" />
          <ULink :href="REPO_URL" target="_blank" class="flex items-center gap-1">
            {{ name }}
            <UIcon name="i-lucide:arrow-up-right" class="size-4" />
          </ULink>
        </h2>
      </div>
    </template>

    <USkeleton v-if="isLoading" class="h-20 w-full" />
    <template v-else>
      <p class="mb-4 text-base text-slate-600 dark:text-slate-400">{{ description }}</p>

      <div class="mb-4 flex flex-wrap gap-2">
        <UTooltip text="Stars" :delay-duration="0">
          <UBadge icon="mdi:star-outline" color="primary" variant="subtle" size="md">
            {{ stars }}
          </UBadge>
        </UTooltip>
        <UTooltip text="Forks" :delay-duration="0">
          <UBadge icon="mdi:source-fork" color="primary" variant="subtle" size="md">
            {{ forks }}
          </UBadge>
        </UTooltip>
        <UTooltip text="Watchers" :delay-duration="0">
          <UBadge icon="mdi:eye-outline" color="neutral" variant="subtle" size="md">
            {{ watchers }}
          </UBadge>
        </UTooltip>
        <UTooltip text="Open issues" :delay-duration="0">
          <UBadge icon="mdi:alert-decagram-outline" color="neutral" variant="subtle" size="md">
            {{ issues }}
          </UBadge>
        </UTooltip>
      </div>

      <ProjectsInstallCommand v-if="project.pkg" :command="project.pkg.installCommand" />
    </template>

    <template v-if="project.subPackages?.length">
      <div class="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
        <h3
          class="font-space-grotesk mb-3 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400"
        >
          {{ project.subPackagesLabel ?? "Sub-packages" }}
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
            <ProjectsInstallCommand :command="pkg.pkg.installCommand" />
          </div>
        </div>
      </div>
    </template>
  </UCard>
</template>
