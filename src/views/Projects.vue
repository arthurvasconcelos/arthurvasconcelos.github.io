<template>
  <div class="projects">
    <PageHeader title="Projects"></PageHeader>
    <PageContent class="projects">
      <div>
        <h2>Title</h2>
        <p>Description</p>
      </div>
    </PageContent>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader.vue";
import PageContent from "@/components/PageContent.vue";

export default {
  name: "Projects",
  components: { PageHeader, PageContent },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "../styles/functions";
@import "../styles/variables";
@import "../styles/mixins";

//
</style>
