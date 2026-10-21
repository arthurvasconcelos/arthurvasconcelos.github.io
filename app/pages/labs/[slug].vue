<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const slug = route.params.slug as string;
const localeDir = locale.value.toLowerCase();

const { data: experiment } = await useAsyncData(`lab-${localeDir}-${slug}`, () =>
  queryCollection("labs").where("path", "=", `/${localeDir}/labs/${slug}`).first(),
);

// No translation for this locale → send to the labs list instead of 404
if (!experiment.value) {
  await navigateTo(localePath("/labs"));
}

useHead({
  title: computed(() =>
    experiment.value ? `${experiment.value.title} — Arthur Vasconcelos` : "Labs",
  ),
});
useSeoMeta({
  title: computed(() => experiment.value?.title ?? ""),
  description: computed(() => experiment.value?.description ?? ""),
  ogTitle: computed(() => experiment.value?.title ?? ""),
  ogDescription: computed(() => experiment.value?.description ?? ""),
});

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}
</script>

<template>
  <UContainer v-if="experiment" as="article" class="mx-auto max-w-3xl py-12">
    <NuxtLink
      :to="localePath('/labs')"
      class="mb-10 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-violet-500"
    >
      <UIcon name="i-material-symbols-arrow-back" class="size-4" />
      {{ t("labs.backToLabs") }}
    </NuxtLink>

    <header class="mb-10">
      <h1 class="mb-4 text-4xl leading-tight font-bold">
        {{ experiment.title }}
      </h1>

      <div
        class="flex flex-wrap items-center gap-x-3 gap-y-1 font-jetbrains text-sm text-[#64748b] dark:text-slate-400"
      >
        <time :datetime="new Date(experiment.date).toISOString()">
          {{ formatDate(experiment.date) }}
        </time>
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
        <UBadge
          v-if="experiment.draft"
          color="warning"
          variant="subtle"
          size="sm"
          class="font-jetbrains"
        >
          {{ t("labs.draft") }}
        </UBadge>
      </div>
    </header>

    <TranslationNotice v-if="experiment.machineTranslated" class="mb-10" />

    <div
      class="prose prose-slate max-w-none dark:prose-invert prose-p:text-base prose-p:leading-relaxed prose-headings:font-space-grotesk prose-headings:font-bold prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-jetbrains prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-code:dark:bg-slate-800"
    >
      <ContentRenderer :value="experiment" />
    </div>
  </UContainer>
</template>
