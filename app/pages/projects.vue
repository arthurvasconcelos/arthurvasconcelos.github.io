<script setup lang="ts">
import { legacyProjects } from "~/data/projects";

const { t } = useI18n();

useHead({ title: computed(() => t("projects.pageTitle")) });
</script>

<template>
  <UContainer as="section" class="py-12">
    <div
      :class="[
        // display
        'grid',
        'grid-flow-dense',
        // layout
        'grid-cols-1',
        'md:grid-cols-2',
        // spacing
        'gap-2',
      ]"
    >
      <projects-item
        v-for="project in legacyProjects"
        :key="project.id"
        :repo="project.repo"
        :npm-create-date="project.npmCreateDate!"
      />
    </div>
  </UContainer>
</template>
