<script setup lang="ts">
import { formatDistanceToNowStrict } from "date-fns";

const socials = [
  {
    name: "GitHub",
    icon: "logos:github-icon",
    link: "#",
  },
  {
    name: "LinkedIn",
    icon: "logos:linkedin-icon",
    link: "#",
  },
  {
    name: "NPM",
    icon: "logos:npm-icon",
    link: "#",
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
    <div class="flex flex-col gap-2 font-slabo">
      <p>HEY YOU,</p>
      <p>
        I'm Arthur Vasconcelos, a {{ age }} old nerd from Brazil living in
        Stockholm, Sweden. I love being a developer and learning new stuff! I am
        currently a senior software engineer at Kognity. But I am also actively
        involved with the Open Source community and developing other projects in
        my spare time.
      </p>
      <p>
        Also I have {{ workExperience }} of experience as a developer and my
        main focus is in frontend development and user interface coding, where I
        have a strong knowledge of Javascript and its tools and frameworks but I
        can develop on the server side too, I can write code in PHP, Javascript
        and Python.
      </p>
      <UIcon name="i-lucide-sun" />
      <UIcon name="i-lucide-moon" />
    </div>
  </div>
</template>
