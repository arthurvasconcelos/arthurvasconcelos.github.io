<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();

useHead({ title: computed(() => t("blog.pageTitle")) });

const localeDir = computed(() => locale.value.toLowerCase());

const { data: posts } = await useAsyncData(`blog-${locale.value}`, async () => {
  const all = await queryCollection("blog")
    .where("path", "LIKE", `/${localeDir.value}/blog/%`)
    .order("date", "DESC")
    .all();
  return all.filter((p) => !p.draft);
});

function postSlug(path: string): string {
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
    <h1 class="text-3xl font-bold mb-8">{{ t("blog.pageTitle") }}</h1>

    <p v-if="!posts?.length" class="text-slate-500">
      {{ t("blog.noPosts") }}
    </p>

    <div v-else class="space-y-6">
      <UCard
        v-for="post in posts"
        :key="post.path"
        class="hover:shadow-lg transition-shadow duration-200"
      >
        <template #header>
          <div class="flex items-start justify-between gap-4">
            <NuxtLink
              :to="localePath(`/blog/${postSlug(post.path)}`)"
              class="text-xl font-semibold hover:text-violet-500 transition-colors leading-snug"
            >
              {{ post.title }}
            </NuxtLink>
            <time
              :datetime="new Date(post.date).toISOString()"
              class="text-sm text-[#64748b] dark:text-slate-400 shrink-0 mt-0.5 font-jetbrains"
            >
              {{ formatDate(post.date) }}
            </time>
          </div>
        </template>

        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          {{ post.description }}
        </p>
      </UCard>
    </div>
  </UContainer>
</template>
