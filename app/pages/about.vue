<script setup lang="ts">
const { t } = useI18n();

useHead({ title: computed(() => t("about.pageTitle")) });
</script>

<template>
  <UContainer as="section" class="py-12">
    <h1 class="text-3xl font-bold mb-8">{{ t("about.pageTitle") }}</h1>
    <AboutMe />
    <AboutSkills />
    <AboutWorkExperiences />
  </UContainer>
</template>
