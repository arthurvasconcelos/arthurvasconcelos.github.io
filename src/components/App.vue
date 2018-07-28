<template>
    <div id="app" class="app">
        <navigation :class="{ 'colorfull': $route.name !== 'intro' }"></navigation>
        <router-view :key="$route.path" class="view router-view" :class="{ 'spaced': $route.name !== 'intro' }" ref="main"></router-view>
        <!-- <transition mode="out-in">
            <router-view :key="$route.path" class="view router-view" ref="main"></router-view>
        </transition> -->
    </div>
</template>

<script>
    import Navigation from './shared/navigation.vue';

    export default {
        name: 'app',
        components: { Navigation },
        data () {
            return {}
        }
    }
</script>

<style lang="scss">
    html,
    body {
        font-size: 16px;
        margin: 0;
        min-height: 100vh;
    }

    .app {
        min-height: 100%;
    }

    .view {
        box-sizing: border-box;

        &.spaced {
            padding-top: 4rem;
        }
    }

    .v-enter,
    .v-leave-to,
    .router-view {
        min-height: 100vh;
        transition: opacity .5s ease, transform .5s ease;
    }

    .v-enter-active,
    .v-leave-active,
    .router-enter,
    .router-leave {
        opacity: 0;
        transform: translate3d(20px, 0, 0);
    }

    /**
    * Special thanks:
    * - Saransh Sinha, animated background inspiration: https://codepen.io/saransh/pen/BKJun
    * - Hendra Susanto, animated menu inspiration: https://tympanus.net/Development/LineMenuStyles/#Shylock
    */
</style>