<template>
  <div class="skill" ref="skill">
    <div class="skill-gaugeContainer">
      <div class="skill-gaugeBackground"></div>
      <div class="skill-gaugeFiller" :style="{ transform: `rotate(${gaugeValue}turn)` }"></div>
      <div class="skill-gaugeHole">{{ value }}%</div>
    </div>
    <div class="skill-text">{{ name }}</div>
  </div>
</template>

<script>
export default {
  name: 'SkillGauge',
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      gaugeValue: this.value / 2 / 100,
      width: 0,
      sizeStyles: { width: `${width}px`, height: `${width / 2}px` }
    }
  },
  mounted() {
    this.applySizeToGauge();
    this.$events.$on('windowResize', this.applySizeToGauge);
  },
  methods: {
    applySizeToGauge() {
      this.width = this.$refs.skill.offsetWidth;
    }
  }
}
</script>

<style lang="scss">
@import '../styles/functions';
@import '../styles/variables';
@import '../styles/mixins';

.skill {
  width: 100%;
}

.skill-gaugeContainer {
  overflow: hidden;
  position: relative;
}

.skill-gaugeBackground {
  background-color: rgba(0,0,0,.2);
  border-radius: 250px 250px 0px 0px;
  position: absolute;
  top: 0%;
  z-index: 1;
}

.skill-gaugeFiller {
  background-color: #5664F9;
  border-radius: 0px 0px 200px 200px;
  height: 200px;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  top: 200px;
  transform-origin: center top;
  transition: all 1.3s ease-in-out;
  width: 400px;
  z-index: 2;
}

.skill-gaugeHole {
  background-color: #222;
  border-radius: 250px 250px 0px 0px;
  height: 125px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0px;
  width: 250px;
  z-index: 3;
}
</style>