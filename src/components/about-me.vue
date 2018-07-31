<template>
    <div class="about-me">
        <page-header title="About Me"></page-header>
        <page-content class="aboutMe">
            <img src="../assets/images/profile.jpg" alt="arthur vasconcelos profile pricture" class="aboutMe-profilePicture">
            <p class="aboutMe-description">I'm an organized and dedicated professional, compromised with the quality of the code and the final product. I’m passionate about my work and I'm always looking forward to learn new things and improve on the ones that I already know.</p>
            <ul class="aboutMe-socialList">
                <li v-for="(social, index) in socials" :key="`social-${index}`">
                    <a :href="social.link" target="_blank">
                        <font-awesome-icon :icon="social.iconName" />
                    </a>
                </li>
            </ul>
        </page-content>
    </div>
</template>

<script>
    import PageHeader from './shared/page-header.vue';
    import PageContent from './shared/page-content.vue';

    export default {
        name: 'about-me',
        components: { PageHeader, PageContent },
        data () {
            return {
                socials: [
                    {
                        link: 'https://facebook.com/vasconcelos.arthur',
                        iconName: ['fab', 'facebook-f']
                    },
                    {
                        link: 'https://twitter.com/jookeringa',
                        iconName: ['fab', 'twitter']
                    },
                    {
                        link: 'https://linkedin.com/in/arthurvasconcelos/',
                        iconName: ['fab', 'linkedin-in']
                    },
                    {
                        link: 'https://github.com/arthurvasconcelos',
                        iconName: ['fab', 'github-alt']
                    },
                    {
                        link: 'https://bitbucket.org/alfv89/',
                        iconName: ['fab', 'bitbucket']
                    },
                    {
                        link: 'https://codepen.io/arthurvasconcelos/',
                        iconName: ['fab', 'codepen']
                    },
                    {
                        link: 'https://jsfiddle.net/user/arthurvasconcelos',
                        iconName: ['fab', 'jsfiddle']
                    },
                    {
                        link: 'https://www.npmjs.com/~arthurvasconcelos',
                        iconName: ['fab', 'npm']
                    },
                    {
                        link: 'https://keybase.io/avasconcelos',
                        iconName: ['fab', 'keybase']
                    },
                    {
                        link: 'https://stackoverflow.com/users/3130385/arthur-vasconcelos',
                        iconName: ['fab', 'stack-overflow']
                    },
                    {
                        link: 'https://www.twitch.tv/jokeringa',
                        iconName: ['fab', 'twitch']
                    },
                    {
                        link: 'https://www.reddit.com/user/jookeringa',
                        iconName: ['fab', 'reddit-alien']
                    }
                    // {
                    //     link: '#',
                    //     iconName: ['fab', 'github-alt']
                    // }
                ]
            }
        }
    }
</script>

<style lang="scss">
    @import '../styles/functions';
    @import '../styles/variables';
    @import '../styles/mixins';

    .aboutMe-profilePicture {
        display: block;
        margin: 0 auto .5em;
        max-width: 320px;
        width: 100%;
    }

    .aboutMe-description {
        margin: 0;
    }

    .aboutMe-socialList {
        display: grid;
        grid-row-gap: .5rem;
        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
        justify-items: center;
        list-style: none;
        margin: 1rem 0 0;
        padding: 0;
    }

    @include mediaQueries(S) {
        .aboutMe-socialList {
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
        }
    }

    @include mediaQueries(M) {
        .aboutMe-profilePicture {
            float: left;
            margin: 0 .5em .5em 0;
        }
    }

    @include mediaQueries(L) {
        .aboutMe-socialList {
            grid-row-gap: 1rem;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            margin: 1.5rem 0 0;
        }
    }

    @include mediaQueries(XL) {
        .aboutMe-socialList {
            grid-row-gap: 1.5rem;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            margin: 2rem 0 0;
        }
    }
</style>