<script setup lang="ts">
const { t } = useI18n();

const wordKeys = ["web", "mobile", "desktop", "server"] as const;

const languages = ref([
  { id: "js-ts", name: "JS/TS" },
  { id: "python", name: "Python" },
  { id: "php", name: "PHP" },
]);

const wordLabels = computed(() => wordKeys.map((key) => t(`home.words.${key}`)));

const h2Label = computed(() => {
  const capitalizedWords = wordKeys.map((k) => useCapitalize(t(`home.words.${k}`)));
  const lastWord = capitalizedWords.pop();
  const joinedWords = capitalizedWords.join(", ");
  const langNames = languages.value.map((lang) => lang.name);
  const lastLang = langNames.pop();
  const joinedLangs = langNames.join(", ");

  return `${t("home.developingFor")} ${joinedWords} ${t("home.and")} ${lastWord} ${t("home.with")} ${joinedLangs} ${t("home.and")} ${lastLang}`;
});

const { currentWord, wordsInterval } = useWriteWords(wordLabels);
const prefersReducedMotion = usePreferredReducedMotion();

onMounted(() => {
  if (prefersReducedMotion.value !== "reduce") {
    wordsInterval();
  }
});
</script>

<template>
  <section class="grow">
    <div class="grid h-full relative z-1">
      <div class="grid h-auto self-center text-center">
        <h1
          :class="[
            // colors
            'text-slate-950',
            'dark:text-slate-300',
            // text
            'font-space-grotesk',
            'text-4xl',
            'font-bold',
            'uppercase',
            // spacing
            'mb-4',
            'px-6',
          ]"
        >
          Arthur Vasconcelos
        </h1>

        <h2
          :class="[
            // colors
            'text-slate-950',
            'dark:text-slate-300',
            // text
            'text-xl',
            // spacing
            'm-0',
            'p-0',
          ]"
          :aria-label="h2Label"
        >
          {{ t("home.developingFor") }}&nbsp;
          <HomeHighlight :capitalize="true" current-class="word-highlight">
            {{ currentWord }}<span class="cursor">_</span>
          </HomeHighlight>
          <span class="phraseBreaker" />
          &nbsp;{{ t("home.with") }}&nbsp;
          <div class="inline-flex gap-2">
            <HomeHighlight
              v-for="language in languages"
              :key="language.id"
              :text="language.name"
              current-class="lang-badge"
            />
          </div>
        </h2>
      </div>
    </div>
  </section>
</template>

<style>
.word-highlight {
  background-color: var(--color-violet-500);
  color: white;
}

.lang-badge {
  background-color: color-mix(in srgb, var(--color-emerald-500) 15%, transparent);
  color: var(--color-emerald-700);
}

:where(.dark, .dark *) .lang-badge {
  background-color: color-mix(in srgb, var(--color-emerald-500) 20%, transparent);
  color: var(--color-emerald-300);
}

.cursor {
  animation: fadeCursor 0.5s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .cursor {
    animation: none;
  }
}

.phraseBreaker {
  display: block;
  height: 0.8rem;
  width: 100%;
}
</style>
