<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();

useHead({ title: computed(() => t("labs.pageTitle")) });

const localeDir = computed(() => locale.value.toLowerCase());

const { data: experiments } = await useAsyncData(`labs-${locale.value}`, async () => {
  const all = await queryCollection("labs")
    .where("path", "LIKE", `/${localeDir.value}/labs/%`)
    .order("date", "DESC")
    .all();
  return all.filter((e) => !e.draft);
});

function experimentSlug(path: string): string {
  return path.split("/").pop()!;
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
</script>

<template>
  <UContainer as="section" class="py-12">
    <h1 class="mb-3 text-3xl font-bold">{{ t("labs.pageTitle") }}</h1>
    <p class="mb-8 max-w-2xl text-slate-600 dark:text-slate-400">
      {{ t("labs.intro") }}
    </p>

    <p v-if="!experiments?.length" class="text-slate-500">
      {{ t("labs.noExperiments") }}
    </p>

    <div v-else class="space-y-6">
      <UCard
        v-for="experiment in experiments"
        :key="experiment.path"
        class="transition-shadow duration-200 hover:shadow-lg"
      >
        <template #header>
          <div class="flex items-start justify-between gap-4">
            <NuxtLink
              :to="localePath(`/labs/${experimentSlug(experiment.path)}`)"
              class="text-xl leading-snug font-semibold text-slate-900 transition-colors hover:text-violet-500 dark:text-slate-100 dark:hover:text-violet-400"
            >
              {{ experiment.title }}
            </NuxtLink>
            <time
              :datetime="new Date(experiment.date).toISOString()"
              class="mt-0.5 shrink-0 font-jetbrains text-sm text-[#64748b] dark:text-slate-400"
            >
              {{ formatDate(experiment.date) }}
            </time>
          </div>
        </template>

        <p class="leading-relaxed text-slate-600 dark:text-slate-400">
          {{ experiment.description }}
        </p>

        <template v-if="experiment.tags?.length" #footer>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="tag in experiment.tags"
              :key="tag"
              color="neutral"
              variant="subtle"
              size="sm"
              class="font-jetbrains"
            >
              {{ tag }}
            </UBadge>
          </div>
        </template>
      </UCard>
    </div>
  </UContainer>
</template>
