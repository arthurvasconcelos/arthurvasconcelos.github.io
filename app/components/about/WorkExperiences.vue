<script setup lang="ts">
import { workExperiencesData } from "~/data/work-experiences";
import { formatWorkExperience } from "~/composables/useWorkExperience";

const { t } = useI18n();
const workExperiences = workExperiencesData.map(formatWorkExperience);
</script>

<template>
  <AboutSectionsHeading :title="t('about.workExperiences.sectionTitle')" class="mt-10 mb-5" />
  <div class="flex flex-col">
    <AboutExperienceContainer
      v-for="experience in workExperiences"
      :key="experience.id"
    >
      <AboutExperienceLogo :experience="experience" />
      <AboutExperiencePeriod :experience="experience" />
      <AboutExperienceDescription :experience="experience" />
    </AboutExperienceContainer>
  </div>
</template>
