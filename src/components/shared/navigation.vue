<template>
    <nav class="mainNavigation">
        <div class="mainNavigation-container">
            <ul class="mainNavigation-list">
                <li class="mainNavigation-list-item">
                    <router-link :to="{ name: 'intro' }" class="mainNavigation-list-link">Home</router-link>
                </li>
                <li class="mainNavigation-list-item">
                    <router-link :to="{ name: 'about-me' }" class="mainNavigation-list-link">About Me</router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        name: 'navigation',
        data () {
            return {}
        }
    }
</script>

<style lang="scss">
    @import '../../styles/variables';

    .mainNavigation {
        box-sizing: border-box;
        padding: 0 5px;
        position: fixed;
        width: 100%;
    }

    .mainNavigation-container {
        margin: 0 auto;
        max-width: 1200px;
        width: 100%;
    }

    .mainNavigation-list {
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
    }

    .mainNavigation-list-item {
        display: block;
        padding: 0 0 .2em;
    }

    .mainNavigation-list-link {
        @include applyFont();
        -khtml-user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-touch-callout: none;
        color: #b5b5b5;
        cursor: pointer;
        display: block;
        font-size: 1.05em;
        margin: 0 1em;
        padding: 1em 0 .8em;
        position: relative;
        text-decoration: none;
        transition: color 0.4s;
        user-select: none;

        &::before,
        &::after {
            bottom: 0;
            content: "";
            height: 3px;
            left: 0;
            position: absolute;
            transform-origin: center left;
            transform: scale3d(0, 1, 1);
            transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
            width: 100%;
        }

        &::before {
            background: #b5b5b5;
            transition-delay: 0.4s;
        }
        
        &::after {
            background: #d94f5c;
        }

        &:hover,
        &:focus {
            color: #b5b5b5;
            outline: none;

            &::before {
                transform: scale3d(1, 1, 1);
                transition-delay: 0s;
            }
        }

        &.is-active-exact {
            color: #d94f5c;

            &:hover,
            &:focus {
                color: #d94f5c;
            }

            &::before,
            &::after {
                transform: scale3d(1, 1, 1);
            }

            &::before {
                transition-delay: 0s;
            }
        }
    }
</style>