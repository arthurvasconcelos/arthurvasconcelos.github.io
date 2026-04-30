<script lang="ts" setup>
import { skillCategories } from "~/data/skills";

const { t } = useI18n();
</script>

<template>
  <AboutSectionsHeading :title="t('about.skills.sectionTitle')" class="mt-10 mb-5" />
  <template v-for="category in skillCategories" :key="category.id">
    <AboutSkillsHeading
      :icon="category.icon"
      :title="t(category.labelKey)"
      class="mb-2.5"
    />
    <AboutSkillsContainer class="mb-5">
      <AboutSkill
        v-for="skill in category.skills"
        :key="skill.id"
        :icon="skill.icon"
        :name="skill.name"
        :level="skill.level"
      />
    </AboutSkillsContainer>
  </template>
</template>
