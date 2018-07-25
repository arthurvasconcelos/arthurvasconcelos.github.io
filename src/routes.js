import Router from 'vue-router';
import Intro from './components/intro.vue';
import AboutMe from './components/about-me.vue';

export default new Router({
    routes: [
        // {
        //     path: '*',
        //     component: NotFound
        // },
        {
            path: '/',
            name: 'intro',
            component: Intro
        },
        {
            path: '/about-me',
            name: 'about-me',
            component: AboutMe
        }
    ],
    mode: 'history',
    base: '/',
    linkActiveClass: 'is-active',
    linkExactActiveClass: 'is-active-exact',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return { selector: to.hash };
        } else if (savedPosition) {
            return savedPosition;
        } else {
            return { x: 0, y: 0 };
        }
    }
});