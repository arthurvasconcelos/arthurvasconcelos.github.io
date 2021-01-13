import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { trackRouter } from "vue-gtag-next";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "intro",
    component: () =>
      import(/* webpackChunkName: "intro" */ "../views/Intro.vue")
  },
  {
    path: "/about-me",
    name: "about-me",
    // route level code-splitting
    // this generates a separate chunk (about-me.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about-me" */ "../views/AboutMe.vue")
  },
  {
    path: "/projects",
    name: "projects",
    component: () =>
      import(/* webpackChunkName: "projects" */ "../views/Projects.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "is-active",
  linkExactActiveClass: "is-active-exact",
  // scrollBehavior(to, from, savedPosition) {
  //   if (to.hash) {
  //     return { selector: to.hash };
  //   } else if (savedPosition) {
  //     return savedPosition;
  //   } else {
  //     return { x: 0, y: 0 };
  //   }
  // },
});

trackRouter(router);

export default router;
