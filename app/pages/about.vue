<script setup lang="ts">
const { t } = useI18n();

useHead({ title: computed(() => t("about.pageTitle")) });
</script>

<template>
  <UContainer as="section" class="py-12">
    <AboutMe />
    <AboutSkills />
    <AboutWorkExperiences />
  </UContainer>
</template>
