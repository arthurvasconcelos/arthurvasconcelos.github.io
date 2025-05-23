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
        class="flex items-center justify-between font-raleway text-2xl font-bold"
      >
        <ULink :href="REPO_URL" target="_blank">
          {{ name }}
          <UIcon name="i-lucide:arrow-up-right" />
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
      <p class="font-slabo text-base mb-6">{{ description }}</p>

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
          <UBadge
            icon="mdi:eye-outline"
            size="xl"
            color="info"
            variant="subtle"
          >
            {{ watchers }}
          </UBadge>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Stars">
          <UBadge
            icon="mdi:star-outline"
            size="xl"
            color="info"
            variant="subtle"
          >
            {{ stars }}
          </UBadge>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Forks">
          <UBadge
            icon="mdi:source-fork"
            size="xl"
            color="info"
            variant="subtle"
          >
            {{ forks }}
          </UBadge>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Issues">
          <UBadge
            icon="mdi:alert-decagram-outline"
            size="xl"
            color="info"
            variant="subtle"
          >
            {{ issues }}
          </UBadge>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Downloads">
          <UBadge
            icon="mdi:cloud-download-outline"
            size="xl"
            color="info"
            variant="subtle"
          >
            {{ downloads }}
          </UBadge>
        </UTooltip>

        <UTooltip :delay-duration="0" text="Version">
          <UBadge icon="mdi:code-json" size="xl" color="info" variant="subtle">
            {{ version }}
          </UBadge>
        </UTooltip>
      </div>
    </template>

    <template #footer>
      <code
        :class="[
          // Text
          'font-source',
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

<style></style>
