<script setup lang="ts">
import { format } from "date-fns";
import type { Endpoints } from "@octokit/types";
import type { PackageJson } from "type-fest";

type UserRepoResponse =
  Endpoints["GET /repos/{owner}/{repo}"]["response"]["data"];

// https://github.com/npm/registry/blob/main/docs/download-counts.md
type PackageDownloadCountsResponse = {
  downloads: number;
  start: string;
  end: string;
  package: string;
};

const { repo, npmCreateDate } = defineProps<{
  repo: string;
  npmCreateDate: string;
}>();

const TODAY = format(new Date(), "yyyy-MM-dd");
const REPO_URL = `https://github.com/arthurvasconcelos/${repo}`;
const GITHUB_ENDPOINT = `https://api.github.com/repos/arthurvasconcelos/${repo}`;
const NPM_ENDPOINT = `https://api.npmjs.org/downloads/point/${npmCreateDate}:${TODAY}/${repo}`;
const PACKAGE_JSON_ENDPOINT = `https://raw.githubusercontent.com/arthurvasconcelos/${repo}/master/package.json`;

const { status: ghStatus, data: ghRepo } = useFetch<UserRepoResponse>(
  GITHUB_ENDPOINT,
  {
    lazy: true,
  }
);
const { status: npmStatus, data: npmDownloads } =
  useFetch<PackageDownloadCountsResponse>(NPM_ENDPOINT, {
    lazy: true,
  });
const { status: packageJsonStatus, data: packageJsonString } = useFetch<string>(
  PACKAGE_JSON_ENDPOINT,
  { lazy: true }
);

const isLoading = computed(
  () =>
    ghStatus.value === "pending" ||
    npmStatus.value === "pending" ||
    packageJsonStatus.value === "pending"
);

const packageJson = computed(
  () => JSON.parse(packageJsonString.value || "{}") as PackageJson
);

const name = computed(() => ghRepo.value?.name || "");
const archived = computed(() => ghRepo.value?.archived || false);
const description = computed(() => ghRepo.value?.description || "");
const watchers = computed(() => ghRepo.value?.subscribers_count || 0);
const stars = computed(() => ghRepo.value?.stargazers_count || 0);
const forks = computed(() => ghRepo.value?.forks_count || 0);
const issues = computed(() => ghRepo.value?.open_issues_count || 0);
const downloads = computed(() => npmDownloads.value?.downloads || 0);
const version = computed(() => packageJson.value?.version || 0);
</script>

<template>
  <UCard>
    <template #header>
      <USkeleton v-if="isLoading" class="h-5 w-full" />
      <h2
        v-else
        class="flex items-center justify-between font-space-grotesk text-2xl font-bold"
      >
        <ULink
          :href="REPO_URL"
          target="_blank"
          class="inline-flex items-center gap-1 text-slate-900 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          {{ name }}
          <UIcon name="i-lucide:arrow-up-right" class="size-5 shrink-0" />
        </ULink>
        <UBadge
          v-if="archived"
          icon="mdi:alert"
          size="lg"
          color="warning"
          variant="solid"
        >
          Archived
        </UBadge>
      </h2>
    </template>

    <USkeleton v-if="isLoading" class="h-5 w-full" />
    <template v-else>
      <p class="text-base mb-6 text-[#475569] dark:text-slate-300">{{ description }}</p>

      <div
        :class="[
          // display
          'grid',
          'grid-flow-dense',
          // layout
          'grid-cols-1',
          'md:grid-cols-3',
          // spacing
          'gap-2',
        ]"
      >
        <UTooltip :delay-duration="0" text="Watchers">
          <span class="stat-badge">
            <UIcon name="mdi:eye-outline" class="size-4 shrink-0" />
            {{ watchers }}
          </span>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Stars">
          <span class="stat-badge">
            <UIcon name="mdi:star-outline" class="size-4 shrink-0" />
            {{ stars }}
          </span>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Forks">
          <span class="stat-badge">
            <UIcon name="mdi:source-fork" class="size-4 shrink-0" />
            {{ forks }}
          </span>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Issues">
          <span class="stat-badge">
            <UIcon name="mdi:alert-decagram-outline" class="size-4 shrink-0" />
            {{ issues }}
          </span>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Downloads">
          <span class="stat-badge">
            <UIcon name="mdi:cloud-download-outline" class="size-4 shrink-0" />
            {{ downloads }}
          </span>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Version">
          <span class="stat-badge">
            <UIcon name="mdi:code-json" class="size-4 shrink-0" />
            {{ version }}
          </span>
        </UTooltip>
      </div>
    </template>

    <template #footer>
      <code
        :class="[
          // Text
          'font-jetbrains',
          'text-xs',
          'whitespace-nowrap',
          // Colors
          'text-gray-800',
          'dark:text-gray-300',
          'bg-gray-300',
          'dark:bg-gray-800',
          // Spacing
          'p-2',
          // Border
          'rounded-md',
          // Sizing
          'block',
        ]"
      >
        npm install --save {{ repo }}
      </code>
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
