<script lang="ts" setup>
import { v4 as uuidv4 } from "uuid";

const languages = ref([
  {
    id: uuidv4(),
    name: "JavaScript",
    level: 100,
    icon: "logos:javascript",
  },
  {
    id: uuidv4(),
    name: "TypeScript",
    level: 100,
    icon: "logos:typescript-icon",
  },
  {
    id: uuidv4(),
    name: "Python",
    level: 70,
    icon: "logos:python",
  },
  {
    id: uuidv4(),
    name: "PHP",
    level: 50,
    icon: "logos:php-alt",
  },
]);
const sortedLanguages = useSorted(languages.value, (a, b) => b.level - a.level);

const frameworks = ref([
  {
    id: uuidv4(),
    name: "Vue",
    level: 100,
    icon: "logos:vue",
  },
  {
    id: uuidv4(),
    name: "Nuxt",
    level: 50,
    icon: "logos:nuxt-icon",
  },
  {
    id: uuidv4(),
    name: "React",
    level: 20,
    icon: "logos:react",
  },
  {
    id: uuidv4(),
    name: "Django",
    level: 70,
    icon: "logos:django-icon",
  },
  {
    id: uuidv4(),
    name: "NodeJS",
    level: 100,
    icon: "logos:nodejs-icon-alt",
  },
  {
    id: uuidv4(),
    name: "Laravel",
    level: 50,
    icon: "logos:laravel",
  },
]);
const sortedFrameworks = useSorted(
  frameworks.value,
  (a, b) => b.level - a.level
);

const other = ref([
  {
    id: uuidv4(),
    name: "PostgreSQL",
    level: 80,
    icon: "logos:postgresql",
  },
]);
const sortedOther = useSorted(other.value, (a, b) => b.level - a.level);
</script>

<template>
  <AboutSectionsHeading title="Skills" class="mt-10 mb-5" />
  <AboutSkillsHeading
    icon="material-symbols:code"
    title="Languages"
    class="mb-2.5"
  />
  <AboutSkillsContainer class="mb-5">
    <AboutSkill
      v-for="language in sortedLanguages"
      :key="language.id"
      :icon="language.icon"
      :name="language.name"
      :level="language.level"
    />
  </AboutSkillsContainer>
  <AboutSkillsHeading
    icon="material-symbols:deployed-code-outline"
    title="Frameworks"
    class="mb-2.5"
  />
  <AboutSkillsContainer class="mb-5">
    <AboutSkill
      v-for="framework in sortedFrameworks"
      :key="framework.id"
      :icon="framework.icon"
      :name="framework.name"
      :level="framework.level"
    />
  </AboutSkillsContainer>
  <AboutSkillsHeading
    icon="material-symbols:rounded-corner-rounded"
    title="Other"
    class="mb-2.5"
  />
  <AboutSkillsContainer class="mb-5">
    <AboutSkill
      v-for="otherSkill in sortedOther"
      :key="otherSkill.id"
      :icon="otherSkill.icon"
      :name="otherSkill.name"
      :level="otherSkill.level"
    />
  </AboutSkillsContainer>
</template>
