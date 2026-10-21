<script setup lang="ts">
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const slug = route.params.slug as string
const localeDir = locale.value.toLowerCase()

const { data: post } = await useAsyncData(`post-${localeDir}-${slug}`, () =>
  queryCollection("blog").where("path", "=", `/${localeDir}/blog/${slug}`).first(),
)

// No translation for this locale → send to the blog list instead of 404
if (!post.value) {
  await navigateTo(localePath("/blog"))
}

const { data: translations } = useContentTranslations("blog", () => post.value?.translationKey)

useHead({
  title: computed(() => (post.value ? `${post.value.title} — Arthur Vasconcelos` : "Blog")),
})
useSeoMeta({
  title: computed(() => post.value?.title ?? ""),
  description: computed(() => post.value?.description ?? ""),
  ogTitle: computed(() => post.value?.title ?? ""),
  ogDescription: computed(() => post.value?.description ?? ""),
})

// @nuxt/content v3 stores the body as minimark: ["tag", props, ...children], children are strings or nested nodes
type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

function readingTime(body: unknown): number {
  let words = 0
  const walk = (node: MinimarkNode) => {
    if (typeof node === "string") {
      words += node.trim().split(/\s+/).filter(Boolean).length
      return
    }
    if (Array.isArray(node)) node.slice(2).forEach((child) => walk(child as MinimarkNode))
  }
  const value = (body as { value?: MinimarkNode[] } | undefined)?.value
  value?.forEach(walk)
  return Math.max(1, Math.ceil(words / 200))
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

const scrollProgress = ref(0)

function calcScrollProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight
  scrollProgress.value = total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0
}

onMounted(() => {
  window.addEventListener("scroll", calcScrollProgress, { passive: true })
  window.addEventListener("resize", calcScrollProgress, { passive: true })
  nextTick(calcScrollProgress)
})

onUnmounted(() => {
  window.removeEventListener("scroll", calcScrollProgress)
  window.removeEventListener("resize", calcScrollProgress)
})
</script>

<template>
  <UContainer v-if="post" as="article" class="mx-auto max-w-3xl py-12">
    <div
      class="fixed top-0 left-0 z-50 h-0.5 bg-violet-500 transition-[width] duration-75 ease-out"
      :style="{ width: `${scrollProgress}%` }"
      aria-hidden="true"
    />
    <NuxtLink
      :to="localePath('/blog')"
      class="mb-10 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-violet-500"
    >
      <UIcon name="i-material-symbols-arrow-back" class="size-4" />
      {{ t("blog.backToBlog") }}
    </NuxtLink>

    <header class="mb-10">
      <h1 class="mb-4 text-4xl leading-tight font-bold">
        {{ post.title }}
      </h1>

      <div
        class="font-jetbrains flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#64748b] dark:text-slate-400"
      >
        <time :datetime="new Date(post.date).toISOString()">
          {{ formatDate(post.date) }}
        </time>
        <span aria-hidden="true">·</span>
        <span>{{ t("blog.readingTime", { n: readingTime(post.body) }) }}</span>
        <UBadge v-if="post.draft" color="warning" variant="subtle" size="sm" class="font-jetbrains">
          {{ t("blog.draft") }}
        </UBadge>
      </div>

      <TranslationLinks :translations="translations ?? []" class="mt-4" />
    </header>

    <TranslationNotice v-if="post.machineTranslated" class="mb-10" />

    <div
      class="prose prose-slate dark:prose-invert prose-p:leading-relaxed prose-p:text-base prose-headings:font-space-grotesk prose-headings:font-bold prose-code:font-jetbrains prose-code:text-sm prose-code:bg-slate-100 prose-code:dark:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none max-w-none"
    >
      <ContentRenderer :value="post" />
    </div>
  </UContainer>
</template>
