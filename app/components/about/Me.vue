<script setup lang="ts">
import { formatDistanceToNowStrict } from "date-fns";

const { t } = useI18n();

const socials = [
  {
    name: "GitHub",
    icon: "logos:github-icon",
    link: "https://github.com/arthurvasconcelos",
  },
  {
    name: "LinkedIn",
    icon: "logos:linkedin-icon",
    link: "https://www.linkedin.com/in/arthurvasconcelos/",
  },
  {
    name: "Stack Overflow",
    icon: "logos:stackoverflow-icon",
    link: "https://stackoverflow.com/users/3130385/arthur-vasconcelos",
  },
  {
    name: "NPM",
    icon: "logos:npm-icon",
    link: "https://www.npmjs.com/~arthurvasconcelos",
  },
  {
    name: "PyPI",
    icon: "logos:pypi",
    link: "https://pypi.org/user/arthurvasconcelos/",
  },
];

const BIRTHDAY = "1989-09-16";
const BEGIN_WORK = "2010-03-01";
const age = ref(
  formatDistanceToNowStrict(new Date(BIRTHDAY), { roundingMethod: "floor" })
);
const workExperience = ref(
  formatDistanceToNowStrict(new Date(BEGIN_WORK), { roundingMethod: "floor" })
);
</script>

<template>
  <div class="flex gap-2.5">
    <div class="flex flex-col gap-2">
      <PlaceholderBox class="w-60 h-60" />
      <div class="flex items-center justify-center gap-3">
        <ULink
          v-for="social in socials"
          :key="social.name"
          :href="social.link"
          target="_blank"
          :class="[
            // boxing
            'flex',
            'items-center',
            'justify-center',
            // color
            'dark:bg-slate-200',
            'dark:hover:bg-slate-300',
            // spacing
            'p-1',
            // border
            'rounded-md',
            // text
            'text-2xl',
          ]"
        >
          <UIcon :name="social.icon" aria-hidden="true" />
          <span class="sr-only">Go to {{ social.name }}</span>
        </ULink>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <p>{{ t('about.bio.greeting') }}</p>
      <p>{{ t('about.bio.intro', { age, years: workExperience }) }}</p>
      <p>{{ t('about.bio.experience', { years: workExperience }) }}</p>
    </div>
  </div>
</template>
