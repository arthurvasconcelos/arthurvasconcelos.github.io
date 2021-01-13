<template>
  <NavigationBar
    :class="{ colorfull: $route.name !== 'intro' }"
  ></NavigationBar>
  <router-view
    :key="$route.path"
    class="view router-view"
    :class="{ spaced: $route.name !== 'intro' }"
    ref="main"
  ></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import NavigationBar from "@/components/NavigationBar.vue";
import { isTouchDevice } from "@/utils";

export default defineComponent({
  name: "app",
  components: { NavigationBar },
  setup() {
    onMounted(() => {
      console.log("mounted in the composition api!");
    });
  },
  mounted() {
    const html = document.querySelector("html");
    html?.classList.add(isTouchDevice() ? "touch" : "noTouch");

    if (!isTouchDevice()) {
      window.addEventListener("mousemove", e =>
        this.$eventBus.emit("windowMouseMove", e)
      );
    }

    window.addEventListener("scroll", e =>
      this.$eventBus.emit("windowScroll", e)
    );

    window.addEventListener("resize", e =>
      this.$eventBus.emit("windowResize", e)
    );
  }
});
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
  transition: opacity 0.5s ease, transform 0.5s ease;
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
