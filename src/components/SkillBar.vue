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

<script>
export default {
  name: "SkillBar",
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
      color: ''
    };
  },
  computed: {
    titleStyles() {
      return {
        // backgroundColor: `${this.color}`
        backgroundColor: "#92a4ab"
      };
    },
    barStyles() {
      return {
        // backgroundColor: `${this.color}`,
        backgroundColor: "#92a4ab",
        width: `${this.value}%`
      };
    }
  },
  mounted() {
    this.color = this.getBgColor();
  },
  methods: {
    getBgColor() {
      const r = this.randomIntFromInterval(0, 255);
      const g = this.randomIntFromInterval(0, 255);
      const b = this.randomIntFromInterval(0, 255);
      return `rgb(${r},${g},${b})`;
    }
  }
};
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
