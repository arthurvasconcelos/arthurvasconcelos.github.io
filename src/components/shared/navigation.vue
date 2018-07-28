<template>
    <nav class="mainNavigation">
        <div class="mainNavigation-container" ref="mainNavigationContainer">
            <div class="relativeWrapper">
                <ul class="mainNavigation-list">
                    <li class="mainNavigation-list-item">
                        <router-link :to="{ name: 'intro' }" class="mainNavigation-list-link">Home</router-link>
                    </li>
                    <li class="mainNavigation-list-item">
                        <router-link :to="{ name: 'about-me' }" class="mainNavigation-list-link">About Me</router-link>
                    </li>
                </ul>

                <button class="closeMenu" v-on:click.prevent="closeMenu"><font-awesome-icon icon="times" /></button>
            </div>
        </div>

        <div class="mainNavigation-trigger" v-on:click="expandMenu"><font-awesome-icon icon="bars" /></div>
    </nav>
</template>

<script>
    export default {
        name: 'navigation',
        data () {
            return {}
        },
        methods: {
            expandMenu(event) {
                this.$refs.mainNavigationContainer.classList.add('is-open');
            },
            closeMenu(event) {
                this.$refs.mainNavigationContainer.classList.remove('is-open');
            }
        }
    }
</script>

<style lang="scss">
    @import '../../styles/functions';
    @import '../../styles/variables';
    @import '../../styles/mixins';

    .relativeWrapper {
        height: 100%;
        position: relative;
        width: 100%;
    }

    .closeMenu {
        background-color: transparent;
        border-radius: 0;
        border: none;
        color: #FFFFFF;
        font-size: 1.5rem;
        left: .5rem;
        padding: 0;
        position: absolute;
        top: .5rem;

        &:focus {
            outline: none;
        }
    }

    .mainNavigation {
        box-sizing: border-box;
        display: grid;
        height: 4rem;
        padding: 0 5px;
        position: fixed;
        width: 100%;
        z-index: 1000;

        &.colorfull {
            background-color: #090A0F;
        }
    }

    .mainNavigation-trigger {
        align-items: center;
        color: #FFFFFF;
        cursor: pointer;
        display: grid;
        font-size: 2.5rem;
        justify-items: center;
        justify-self: end;
        margin-right: .3em;
    }

    .mainNavigation-container {
        background: linear-gradient(#1B2735 0%, #090A0F 100%);
        height: 100%;
        max-width: 80%;
        position: fixed;
        right: 0;
        top: 0;
        transform: translateX(100%);
        transition: transform .3s ease-in-out;
        width: 100%;

        &.is-open {
            transform: translateX(0);
        }
    }

    .mainNavigation-list {
        display: flex;
        flex-direction: column;
        height: 100%;
        list-style: none;
        margin: 0;
        padding: 3rem 0 0;
        width: 100%;
    }

    .mainNavigation-list-item {
        display: block;
    }

    .mainNavigation-list-link {
        @include applyFont();
        -khtml-user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-touch-callout: none;
        box-sizing: border-box;
        color: #b5b5b5;
        cursor: pointer;
        display: block;
        font-size: 1.05rem;
        margin: 0 0 1em;
        padding: 0 .5rem .5em;
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
            transition: transform .4s cubic-bezier(0.22, 0.61, 0.36, 1);
            width: 100%;
        }

        &::before {
            background: #b5b5b5;
            transform: scale3d(1, 1, 1);
            transition-delay: .4s;
        }
        
        &::after {
            background: #d94f5c;
            transform: scale3d(0, 1, 1);
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

    // Media Queries

    @include mediaQueries(L) {
        .mainNavigation-trigger {
            display: none;
        }

        .closeMenu {
            display: none;
        }

        .mainNavigation-container {
            background: transparent;
            display: block;
            justify-self: center;
            max-width: 1200px;
            position: relative;
            right: auto;
            top: auto;
            transform: none;
            transition: none;
        }

        .mainNavigation-list {
            align-items: center;
            flex-direction: row;
            justify-content: flex-end;
            padding: 0;
        }

        .mainNavigation-list-link {
            margin: 0 1em 1em;
            padding: 1em 0 .5em;

            &::before,
            &::after {
                transform: scale3d(0, 1, 1);
            }
        }
    }
</style>