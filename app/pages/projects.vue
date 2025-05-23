<script setup lang="ts">
definePageMeta({
  title: "Projects",
});

const projects = ref([
  {
    repo: "vue-izitoast",
    npmCreateDate: "2018-01-28",
  },
  {
    repo: "vue-cbsc",
    npmCreateDate: "2018-02-16",
  },
]);
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
        v-for="project in projects"
        :key="project.repo"
        :repo="project.repo"
        :npm-create-date="project.npmCreateDate"
      />
    </div>
  </UContainer>
</template>
