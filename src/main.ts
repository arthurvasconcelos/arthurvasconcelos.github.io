import { createApp } from "vue";
import { createGtm } from "vue-gtm";
import VueGtag from "vue-gtag-next";
import App from "./App.vue";
import "./registerFontAwesomeIcons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import eventBus from "./bus";

createApp(App)
  .use(store)
  .use(router)
  .use(VueGtag, {
    property: {
      id: "UA-28901644-2"
    }
  })
  .use(
    createGtm({
      id: "GTM-M83J9VG",
      defer: false,
      compatibility: false,
      enabled: true,
      debug: process.env.NODE_ENV !== "production",
      // loadScript: true,
      vueRouter: router,
      // ignoredViews: ['homepage'],
      trackOnNextTick: false
    })
  )
  .use(eventBus)
  .component("FontAwesomeIcon", FontAwesomeIcon)
  .mount("#app");
