<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const slug = route.params.slug as string;
const localeDir = locale.value.toLowerCase();

const { data: post } = await useAsyncData(`post-${localeDir}-${slug}`, () =>
  queryCollection("blog")
    .where("path", "=", `/${localeDir}/blog/${slug}`)
    .first(),
);

// No translation for this locale → send to the blog list instead of 404
if (!post.value) {
  await navigateTo(localePath("/blog"));
}

const { data: translations } = await useAsyncData(
  `translations-${post.value?.translationKey ?? `${localeDir}-${slug}`}`,
  async () => {
    const key = post.value?.translationKey;
    if (!key) return [];
    const all = await queryCollection("blog")
      .where("translationKey", "=", key)
      .all();
    return all.filter((p) => !p.draft && !p.path.startsWith(`/${localeDir}/`));
  },
);

useHead({
  title: computed(() =>
    post.value ? `${post.value.title} — Arthur Vasconcelos` : "Blog",
  ),
});
useSeoMeta({
  title: computed(() => post.value?.title ?? ""),
  description: computed(() => post.value?.description ?? ""),
  ogTitle: computed(() => post.value?.title ?? ""),
  ogDescription: computed(() => post.value?.description ?? ""),
});

function readingTime(body: any): number {
  let words = 0;
  const walk = (node: any) => {
    if (node.type === "text" && node.value) {
      words += (node.value as string).trim().split(/\s+/).filter(Boolean).length;
    }
    node.children?.forEach(walk);
  };
  body?.children?.forEach(walk);
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

const scrollProgress = ref(0);

function calcScrollProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.value = total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0;
}

onMounted(() => {
  window.addEventListener("scroll", calcScrollProgress, { passive: true });
  window.addEventListener("resize", calcScrollProgress, { passive: true });
  nextTick(calcScrollProgress);
});

onUnmounted(() => {
  window.removeEventListener("scroll", calcScrollProgress);
  window.removeEventListener("resize", calcScrollProgress);
});

const DIR_TO_LOCALE: Record<string, string> = {
  "en-gb": "en-GB",
  "pt-br": "pt-BR",
  sv: "sv",
};

const LOCALE_NAMES: Record<string, string> = {
  "en-GB": "English",
  "pt-BR": "Português",
  sv: "Svenska",
};

function translationUrl(contentPath: string): string {
  const parts = contentPath.split("/");
  const dir = parts[1];
  const postSlug = parts.at(-1)!;
  if (dir === "en-gb") return `/blog/${postSlug}`;
  return `/${dir}/blog/${postSlug}`;
}

function translationName(contentPath: string): string {
  const dir = contentPath.split("/")[1] ?? "";
  const code = DIR_TO_LOCALE[dir];
  return (code ? LOCALE_NAMES[code] : undefined) ?? dir;
}
</script>

<template>
  <UContainer v-if="post" as="article" class="py-12 max-w-3xl mx-auto">
    <div
      class="fixed top-0 left-0 z-50 h-0.5 bg-violet-500 transition-[width] duration-75 ease-out"
      :style="{ width: `${scrollProgress}%` }"
      aria-hidden="true"
    />
    <NuxtLink
        :to="localePath('/blog')"
        class="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-500 transition-colors mb-10"
      >
        <UIcon name="i-material-symbols-arrow-back" class="size-4" />
        {{ t("blog.backToBlog") }}
      </NuxtLink>

      <header class="mb-10">
        <h1 class="text-4xl font-bold leading-tight mb-4">
          {{ post.title }}
        </h1>

        <div
          class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#64748b] dark:text-slate-400 font-jetbrains"
        >
          <time :datetime="new Date(post.date).toISOString()">
            {{ formatDate(post.date) }}
          </time>
          <span aria-hidden="true">·</span>
          <span>{{ t("blog.readingTime", { n: readingTime(post.body) }) }}</span>
          <UBadge
            v-if="post.draft"
            color="warning"
            variant="subtle"
            size="sm"
            class="font-jetbrains"
          >
            {{ t("blog.draft") }}
          </UBadge>
        </div>

        <div
          v-if="translations?.length"
          class="mt-4 text-sm text-slate-500 flex flex-wrap items-center gap-2"
        >
          <span>{{ t("blog.alsoAvailableIn") }}</span>
          <NuxtLink
            v-for="tr in translations"
            :key="tr.path"
            :to="translationUrl(tr.path)"
            class="text-violet-500 hover:text-violet-400 transition-colors"
          >
            {{ translationName(tr.path) }}
          </NuxtLink>
        </div>
      </header>

      <div
        class="prose prose-slate dark:prose-invert max-w-none
               prose-p:leading-relaxed prose-p:text-base
               prose-headings:font-space-grotesk prose-headings:font-bold
               prose-code:font-jetbrains prose-code:text-sm prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
      >
        <ContentRenderer :value="post" />
      </div>
  </UContainer>
</template>
