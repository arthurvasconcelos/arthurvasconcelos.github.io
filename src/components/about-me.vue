<template>
    <div class="about-me">
        <page-header title="About Me"></page-header>
        <article class="container">
            me
        </article>
    </div>
</template>

<script>
    import PageHeader from './shared/page-header.vue';

    export default {
        name: 'about-me',
        components: { PageHeader },
        data () {
            return {}
        }
    }
</script>

<style lang="scss">
    .container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
    }
</style>