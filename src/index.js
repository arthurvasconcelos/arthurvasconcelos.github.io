import Vue from 'vue';
import VueRouter from 'vue-router';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import router from './routes';

import App from './components/app.vue';

Vue.use(VueRouter);

library.add([faCoffee, faBars, faTimes]);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
    el: '#app',
    router,
    render: h => h(App)
});