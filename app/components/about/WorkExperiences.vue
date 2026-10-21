<script setup lang="ts">
import { useWorkExperiences } from "~/composables/useWorkExperience"

const { t } = useI18n()
const workExperiences = useWorkExperiences()
</script>

<template>
  <AboutSectionsHeading :title="t('about.workExperiences.sectionTitle')" class="mt-10 mb-5" />
  <ol class="relative ml-7 border-l-2 border-slate-300 sm:ml-8 dark:border-slate-700">
    <AboutExperienceItem
      v-for="experience in workExperiences"
      :key="experience.id"
      :experience="experience"
    />
  </ol>
</template>
