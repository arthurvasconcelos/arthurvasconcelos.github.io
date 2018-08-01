<template>
  <article class="pageContent">
    <slot></slot>
  </article>
</template>

<script>
export default {
  name: 'PageContent'
}
</script>

<style lang="scss">
@import '../styles/variables';
@import '../styles/mixins';

.pageContent {
  @include applyFont(aux);

  box-sizing: border-box;
  font-size: 1.5rem;
  margin: 0 auto;
  max-width: 1200px;
  padding: .5em .8em;
  width: 100%;
}
</style>