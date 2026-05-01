<script setup lang="ts">
import { flagshipProjects, standaloneProjects, legacyProjects } from "~/data/projects";

const { t } = useI18n();

useHead({ title: computed(() => t("projects.pageTitle")) });
</script>

<template>
  <UContainer as="section" class="py-12 space-y-12">
    <h1 class="text-3xl font-bold">{{ t("projects.pageTitle") }}</h1>
    <section>
      <AboutSectionsHeading :title="t('projects.sections.flagship')" class="mb-6" />
      <div class="grid gap-4">
        <ProjectsCard
          v-for="project in flagshipProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </section>

    <section>
      <AboutSectionsHeading :title="t('projects.sections.standalone')" class="mb-6" />
      <div class="grid gap-4">
        <ProjectsCard
          v-for="project in standaloneProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </section>

    <section>
      <AboutSectionsHeading :title="t('projects.sections.legacy')" class="mb-6" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
        <projects-item
          v-for="project in legacyProjects"
          :key="project.id"
          :repo="project.repo"
          :npm-create-date="project.npmCreateDate!"
        />
      </div>
    </section>
  </UContainer>
</template>
