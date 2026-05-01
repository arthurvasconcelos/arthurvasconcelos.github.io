<script setup lang="ts">
import type { Project } from "~/data/projects";
import type { Endpoints } from "@octokit/types";

type UserRepoResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

const { project } = defineProps<{ project: Project }>();

const REPO_URL = `https://github.com/arthurvasconcelos/${project.repo}`;
const GITHUB_ENDPOINT = `https://api.github.com/repos/arthurvasconcelos/${project.repo}`;

const { status, data: ghData } = useFetch<UserRepoResponse>(GITHUB_ENDPOINT, { lazy: true });

const isLoading = computed(() => status.value === "pending");
const name = computed(() => ghData.value?.name || project.name);
const description = computed(() => ghData.value?.description || "");
const stars = computed(() => ghData.value?.stargazers_count ?? 0);
const forks = computed(() => ghData.value?.forks_count ?? 0);
const watchers = computed(() => ghData.value?.subscribers_count ?? 0);
const issues = computed(() => ghData.value?.open_issues_count ?? 0);
</script>

<template>
  <UCard>
    <template #header>
      <USkeleton v-if="isLoading" class="h-6 w-48" />
      <div v-else class="flex items-center justify-between">
        <h2 class="font-space-grotesk text-2xl font-bold flex items-center gap-2">
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
      <p class="text-base mb-4 text-slate-600 dark:text-slate-400">{{ description }}</p>

      <div class="flex flex-wrap gap-2 mb-4">
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

      <code
        v-if="project.pkg"
        class="font-jetbrains text-xs text-slate-800 dark:text-slate-300 bg-slate-200 dark:bg-slate-800 p-2 rounded-md block"
      >
        {{ project.pkg.installCommand }}
      </code>
    </template>

    <template v-if="project.sdks?.length">
      <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <h3
          class="font-space-grotesk text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3"
        >
          SDKs
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div
            v-for="sdk in project.sdks"
            :key="sdk.id"
            class="flex flex-col gap-2 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50"
          >
            <div class="flex items-center gap-1.5">
              <UIcon :name="sdk.languageIcon" class="size-4 shrink-0" />
              <span class="text-sm font-medium">{{ sdk.language }}</span>
            </div>
            <code
              class="font-jetbrains text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-1.5 rounded"
            >
              {{ sdk.pkg.installCommand }}
            </code>
          </div>
        </div>
      </div>
    </template>
  </UCard>
</template>
