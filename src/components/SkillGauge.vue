<template>
  <div class="skill" ref="skill">
    <div class="skill-gaugeContainer" :style="gaugeContainerStyles">
      <div class="skill-gaugeBackground"></div>
      <div class="skill-gaugeFiller" :style="gaugeFillerStyles"></div>
      <div class="skill-gaugeHole" :style="gaugeHoleStyles">{{ value }}%</div>
    </div>
    <div class="skill-text">{{ name }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { randomIntFromInterval } from "@/utils";
import { bus } from "@/bus";

export default defineComponent({
  name: "SkillGauge",
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
    const skill = ref<HTMLDivElement | null>(null);
    const width = ref(0);
    const gaugeValue = computed(() => props.value / 2 / 100);
    const height = computed(() => width.value / 2);
    const gaugeContainerStyles = computed(() => ({
      borderRadius: `${height.value}px ${height.value}px 0px 0px`,
      height: `${height.value}px`
    }));
    const gaugeFillerStyles = computed(() => {
      const r = randomIntFromInterval(0, 255);
      const g = randomIntFromInterval(0, 255);
      const b = randomIntFromInterval(0, 255);
      const a = 0.8;
      return {
        backgroundColor: `rgb(${r},${g},${b},${a})`,
        transform: `rotate(${gaugeValue.value}turn)`
      };
    });
    const gaugeHoleStyles = computed(() => {
      const reducedHeight = height.value / 1.5;
      return {
        borderRadius: `${reducedHeight}px ${reducedHeight}px 0px 0px`,
        height: `${reducedHeight}px`,
        width: `${width.value / 1.5}px`
      };
    });

    function applySizeToGauge() {
      if (skill.value) width.value = skill.value.offsetWidth;
    }

    onMounted(() => {
      applySizeToGauge();
      bus.on("windowResize", applySizeToGauge);
    });

    return { skill, gaugeContainerStyles, gaugeFillerStyles, gaugeHoleStyles };
  }
});
</script>

<style lang="scss">
@import "../styles/functions";
@import "../styles/variables";
@import "../styles/mixins";

.skill {
  width: 100%;
}

.skill-gaugeContainer {
  overflow: hidden;
  position: relative;
  width: 100%;
}

.skill-gaugeBackground {
  background-color: rgba(0, 0, 0, 0.2);
  height: 100%;
  position: absolute;
  top: 0%;
  width: 100%;
  z-index: 1;
}

.skill-gaugeFiller {
  bottom: -100%;
  height: 100%;
  position: absolute;
  transform-origin: center top;
  transition: transform 1.3s ease-in-out;
  width: 100%;
  z-index: 2;
}

.skill-gaugeHole {
  align-content: center;
  background-color: #ffffff;
  bottom: 0px;
  color: #323232;
  display: grid;
  font-size: 1.7rem;
  justify-content: center;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  z-index: 3;
}

.skill-text {
  font-size: 1rem;
  text-align: center;
  text-transform: uppercase;
  width: 100%;
}

@include mediaQueries(XS) {
  .skill-gaugeHole {
    font-size: 2.1rem;
  }

  .skill-text {
    font-size: 1.3rem;
  }
}

@include mediaQueries(S) {
  .skill-gaugeHole {
    font-size: 2.3rem;
  }

  .skill-text {
    font-size: 1.4rem;
  }
}

@include mediaQueries(XL) {
  .skill-gaugeHole {
    font-size: 2.8rem;
  }

  .skill-text {
    font-size: 1.6rem;
  }
}
</style>
