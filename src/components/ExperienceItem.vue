<template>
  <div class="experienceGrid-item">
    <div class="experienceGrid-item-cover">
      <img :src="require(`../assets/images/companies/${logo}`)" />
    </div>
    <div class="experienceGrid-item-data">
      <div class="experienceGrid-item-data-header">
        <h2>{{ role }} @ {{ name }}</h2>
        <small>{{ start }} – {{ end }} {{ durationText }}</small>
      </div>
      <p class="experienceGrid-item-data-description">{{ description }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { isValid, format } from "date-fns";
import { jobDuration } from "@/utils";

export default defineComponent({
  name: "ExperienceItem",
  props: {
    logo: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    join: {
      type: String,
      required: true,
      validator: (value: string) => {
        return isValid(new Date(value));
      },
    },
    leave: {
      type: String,
      validator: (value: null | string) => {
        return value === null || isValid(new Date(value));
      },
    },
  },
  setup(props) {
    const start = format(new Date(props.join), "MMM yyyy");
    const end = props.leave
      ? format(new Date(props.leave), "MMM yyyy")
      : "Current";
    const duration = jobDuration(
      props.join.split("-").map(v => parseInt(v)) as [number, number, number],
      !props.leave
        ? null
        : (props.leave.split("-").map(v => parseInt(v)) as [
            number,
            number,
            number
          ])
    );
    const durationText = duration ? `(${duration})` : "";

    return { start, end, durationText };
  },
});
</script>

<style lang="scss">
@import "../styles/functions";
@import "../styles/variables";
@import "../styles/mixins";

.experienceGrid-item {
  display: flex;
  width: 100%;
  align-items: flex-start;
}

.experienceGrid-item-cover {
  width: 30%;
  margin: 0 10px 0 0;
  flex-shrink: 0;

  img {
    width: 100%;
  }
}

.experienceGrid-item-data {
  width: 100%;
}

.experienceGrid-item-data-header {
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 22px;
    margin: 0;
  }

  small {
    font-size: 16px;
    // margin-left: auto;
  }
}

.experienceGrid-item-data-description {
  font-size: 18px;
  margin: 10px 0 0;
}
</style>
