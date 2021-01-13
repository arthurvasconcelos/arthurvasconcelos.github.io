<template>
  <div class="skillBar" ref="skill">
    <div class="skillBar-title" :style="titleStyles">
      <span>{{ name }}</span>
    </div>
    <div class="skillBar-bar">
      <div class="skillBar-bar-filler" :style="barStyles"></div>
    </div>
    <div class="skillBar-percent">{{ value }}%</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { randomIntFromInterval } from "@/utils";

export default defineComponent({
  name: "SkillBar",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 100 && Number.isInteger(value);
      }
    }
  },
  setup(props) {
    const color = ref("");
    const titleStyles = computed(() => ({
      // backgroundColor: `${color.value}`
      backgroundColor: "#92a4ab"
    }));
    const barStyles = computed(() => ({
      // backgroundColor: `${color.value}`,
      backgroundColor: "#92a4ab",
      width: `${props.value}%`
    }));

    function getBgColor() {
      const r = randomIntFromInterval(0, 255);
      const g = randomIntFromInterval(0, 255);
      const b = randomIntFromInterval(0, 255);
      return `rgb(${r},${g},${b})`;
    }

    onMounted(() => {
      color.value = getBgColor();
    });

    return { color, titleStyles, barStyles };
  },
});
</script>

<style lang="scss">
@import "../styles/functions";
@import "../styles/variables";
@import "../styles/mixins";

.skillBar {
  width: 100%;
  display: flex;
  position: relative;
  border-radius: 3px;
  overflow: hidden;
}

.skillBar-title {
  @include applyFont(main);
  width: 120px;
  flex-shrink: 0;

  span {
    background-color: rgba(0, 0, 0, 0.15);
    color: #ffffff;
    display: block;
    font-size: 19px;
    padding: 5px 0;
    text-align: center;
  }
}

.skillBar-bar {
  width: 100%;
  background-color: #d6d6d6;
}

.skillBar-bar-filler {
  height: 100%;
}

.skillBar-percent {
  @include applyFont(mono);
  position: absolute;
  right: 10px;
  top: 50%;
  font-size: 18px;
  transform: translateY(-50%);
}

@include mediaQueries(XS) {
  //
}

@include mediaQueries(S) {
  //
}

@include mediaQueries(XL) {
  //
}
</style>
