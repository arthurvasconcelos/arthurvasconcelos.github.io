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

<script>
export default {
  name: "SkillGauge",
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      default: 0,
      validator(value) {
        return value >= 0 && value <= 100 && Number.isInteger(value);
      }
    }
  },
  data() {
    return {
      skillElement: null,
      width: 0
    };
  },
  computed: {
    gaugeValue() {
      return this.value / 2 / 100;
    },
    height() {
      return this.width / 2;
    },
    gaugeContainerStyles() {
      return {
        borderRadius: `${this.height}px ${this.height}px 0px 0px`,
        height: `${this.height}px`
      };
    },
    gaugeFillerStyles() {
      const r = this.randomIntFromInterval(0, 255);
      const g = this.randomIntFromInterval(0, 255);
      const b = this.randomIntFromInterval(0, 255);
      const a = 0.8;

      return {
        backgroundColor: `rgb(${r},${g},${b},${a})`,
        transform: `rotate(${this.gaugeValue}turn)`
      };
    },
    gaugeHoleStyles() {
      const reducedHeight = this.height / 1.5;
      return {
        borderRadius: `${reducedHeight}px ${reducedHeight}px 0px 0px`,
        height: `${reducedHeight}px`,
        width: `${this.width / 1.5}px`
      };
    }
  },
  mounted() {
    this.skillElement = this.$refs.skill;
    this.applySizeToGauge();
    this.$events.$on("windowResize", this.applySizeToGauge);
  },
  methods: {
    applySizeToGauge() {
      this.width = this.skillElement.offsetWidth;
    }
  }
};
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
