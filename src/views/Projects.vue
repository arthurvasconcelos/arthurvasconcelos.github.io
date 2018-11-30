<template>
  <div class="projects">
    <PageHeader title="Projects"></PageHeader>
    <PageContent class="projects">
      <div class="projectList">
        <ProjectItem
          v-for="(project, pjtIndex) in projects"
          :key="`project-${pjtIndex}`"
          :repo="project.name"
          :createDate="project.npmCreateDate"></ProjectItem>
      </div>
    </PageContent>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader.vue";
import PageContent from "@/components/PageContent.vue";
import ProjectItem from "@/components/ProjectItem.vue";

export default {
  name: "Projects",
  components: { PageHeader, PageContent, ProjectItem },
  data() {
    return {
      projects: [
        {
          name: "vue-izitoast",
          npmCreateDate: "2018-01-28"
        },
        {
          name: "vue-cbsc",
          npmCreateDate: "2018-02-16"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
@import "../styles/functions";
@import "../styles/variables";
@import "../styles/mixins";

.projectList {
  display: grid;
  grid-column-gap: 25px;
  grid-row-gap: 25px;
  grid-template-columns: 1fr;
}

@include mediaQueries(M) {
  .projectList {
    grid-template-columns: 1fr 1fr;
  }
}

@include mediaQueries(L) {
  .projectList {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
