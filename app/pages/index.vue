<script setup lang="ts">
import capitalize from "lodash/capitalize";
import { v4 as uuidv4 } from "uuid";

const { t } = useI18n();

const wordKeys = ["web", "mobile", "desktop", "server"] as const;
const wordCssClasses: Record<string, string> = {
  web: "web",
  mobile: "mobile",
  desktop: "desktop",
  server: "server",
};

const languages = ref([
  { id: uuidv4(), name: "JS/TS", class: "js-ts" },
  { id: uuidv4(), name: "Python", class: "python" },
  { id: uuidv4(), name: "PHP", class: "php" },
]);

const wordLabels = computed(() => wordKeys.map((key) => t(`home.words.${key}`)));

const h2Label = computed(() => {
  const capitalizedWords = wordKeys.map((k) => capitalize(t(`home.words.${k}`)));
  const lastWord = capitalizedWords.pop();
  const joinedWords = capitalizedWords.join(", ");
  const langNames = languages.value.map((lang) => lang.name);
  const lastLang = langNames.pop();
  const joinedLangs = langNames.join(", ");

  return `${t("home.developingFor")} ${joinedWords} ${t("home.and")} ${lastWord} ${t("home.with")} ${joinedLangs} ${t("home.and")} ${lastLang}`;
});

const { currentWord, currentIndex, wordsInterval } = useWriteWords(wordLabels);
const currentCssClass = computed(
  () => wordCssClasses[wordKeys[currentIndex.value] ?? "web"] ?? "web"
);

onMounted(() => {
  wordsInterval();
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
            'font-raleway',
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
            'font-slabo',
            'text-xl',
            // spacing
            'm-0',
            'p-0',
          ]"
          :aria-label="h2Label"
        >
          {{ t("home.developingFor") }}&nbsp;
          <HomeHighlight
            :capitalize="true"
            :does-transition="true"
            :current-class="currentCssClass"
          >
            {{ currentWord }}<span class="cursor">_</span>
          </HomeHighlight>
          <span class="phraseBreaker" />
          &nbsp;{{ t("home.with") }}&nbsp;
          <div class="inline-flex gap-2">
            <HomeHighlight
              v-for="language in languages"
              :key="language.id"
              :text="language.name"
              :current-class="language.class"
            />
          </div>
        </h2>
      </div>
    </div>
  </section>
</template>

<style>
.web {
  background-color: #e65126;
  color: #eeeff1;
}

.mobile {
  background-color: #488aff;
  color: #ffffff;
}

.desktop {
  background-color: #393c4b;
  color: #a9edfa;
}

.server {
  background-color: #83cd29;
  color: #404137;
}

.cursor {
  animation: fadeCursor 0.5s ease-in-out infinite;
}

.phraseBreaker {
  display: block;
  height: 0.8rem;
  width: 100%;
}

.js-ts {
  background-image: linear-gradient(
    115deg,
    var(--color-javascript-2) 50%,
    var(--color-black) 50%
  );
  color: transparent;
  position: relative;

  &:before,
  &:after {
    content: attr(data-text);
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    user-select: none;
  }

  &:before {
    color: var(--color-javascript-1);
    z-index: 1;
  }

  &:after {
    color: var(--color-white);
    z-index: 2;
    clip-path: polygon(61% 0, 100% 0, 100% 100%, 40% 100%);
  }

  &:where(.dark, .dark *) {
    background-image: linear-gradient(
      115deg,
      var(--color-javascript-1) 50%,
      var(--color-typescript-1) 50%
    );

    &:before {
      color: var(--color-javascript-2);
    }

    &:after {
      color: var(--color-white);
    }
  }
}

.python {
  background-color: var(--color-python-1);
  color: var(--color-python-2);

  &:where(.dark, .dark *) {
    background-color: var(--color-python-2);
    color: var(--color-python-1);
  }
}

.php {
  background-color: var(--color-php-1);
  color: var(--color-black);

  &:where(.dark, .dark *) {
    color: var(--color-white);
  }

  to {
    opacity: 0;
  }
}
</style>
