<template>
  <article class="pageContent">
    <slot></slot>
  </article>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageContent"
});
</script>

<style lang="scss">
@import "../styles/variables";
@import "../styles/mixins";

.pageContent {
  @include applyFont(aux);

  box-sizing: border-box;
  font-size: 1.5rem;
  margin: 0 auto;
  max-width: 1200px;
  padding: 0.5em 0.8em;
  width: 100%;
}
</style>
