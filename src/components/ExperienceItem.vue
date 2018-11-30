<template>
  <div class="experienceGrid-item">
    <div class="experienceGrid-item-cover">
      <img :src="require(`../assets/images/companies/${logo}`)" />
    </div>
    <div class="experienceGrid-item-data">
      <div class="experienceGrid-item-data-header">
        <h2>{{ role }} @ {{ name }}</h2>
        <small>{{ getMonthYear(join) }} – {{ getMonthYear(leave) }} ({{ jobDuration(join, leave) }})</small>
      </div>
      <p class="experienceGrid-item-data-description">{{ description }}</p>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ExperienceItem",
  props: {
    logo: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    join: {
      type: String,
      validator(value) {
        return moment(value).isValid();
      }
    },
    leave: {
      type: String,
      validator(value) {
        return value === null || moment(value).isValid();
      }
    }
  },
  data() {
    return {};
  },
  computed: {},
  mounted() {},
  methods: {
    getMonthYear(dateString) {
      if (dateString) {
        const currDate = moment(dateString);
        return currDate.format("MMM, YYYY");
      }

      return "Current";
    }
  }
};
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
