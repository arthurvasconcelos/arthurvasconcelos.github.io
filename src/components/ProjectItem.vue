<template>
  <div class="project" ref="project">
    <div class="project-loading" :class="{ 'is-loaded': isLoaded }">
      <FontAwesomeIcon :icon="['fas', 'spinner']" pulse />
    </div>

    <div class="project-body">
      <h2 class="project-name">{{ name }}</h2>
      <p class="project-description">{{ description }}</p>
      <ul class="statList">
        <li class="statList-item">
          <a
            class="statList-link"
            :href="`https://github.com/arthurvasconcelos/${name}/watchers`"
            target="_blank"
            title="Watchers"
          >
            <FontAwesomeIcon :icon="['fas', 'eye']" />
            <span class="statList-item-value">{{ watchers }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a
            class="statList-link"
            :href="`https://github.com/arthurvasconcelos/${name}/stargazers`"
            target="_blank"
            title="Stars"
          >
            <FontAwesomeIcon :icon="['fas', 'star']" />
            <span class="statList-item-value">{{ stars }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a
            class="statList-link"
            :href="
              `https://github.com/arthurvasconcelos/${name}/network/members`
            "
            target="_blank"
            title="Forks"
          >
            <FontAwesomeIcon :icon="['fas', 'code-branch']" />
            <span class="statList-item-value">{{ forks }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a
            class="statList-link"
            :href="`https://github.com/arthurvasconcelos/${name}/issues`"
            target="_blank"
            title="Issues"
          >
            <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" />
            <span class="statList-item-value">{{ issues }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a
            class="statList-link"
            :href="`https://github.com/arthurvasconcelos/${name}`"
            target="_blank"
            title="Version"
          >
            <FontAwesomeIcon :icon="['fas', 'code']" />
            <span class="statList-item-value">{{ version }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a
            class="statList-link"
            :href="`https://www.npmjs.com/package/${name}`"
            target="_blank"
            title="Downloads"
          >
            <FontAwesomeIcon :icon="['fas', 'cloud-download-alt']" />
            <span class="statList-item-value">{{ downloads }}</span>
          </a>
        </li>
      </ul>

      <code class="installCommand">npm install --save {{ name }}</code>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onBeforeMount } from "vue";
import { format } from "date-fns";
import axios from "axios";

const GITHUB_ENDPOINT = "https://api.github.com/repos/arthurvasconcelos/";

export default defineComponent({
  name: "ProjectItem",
  props: {
    repo: {
      type: String,
      required: true
    },
    createDate: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const name = ref("");
    const description = ref("");
    const watchers = ref(0);
    const stars = ref(0);
    const forks = ref(0);
    const issues = ref(0);
    const version = ref(0);
    const downloads = ref(0);
    const flags = reactive({
      gh: false,
      downloads: false,
      version: false
    });
    const isLoaded = computed(
      () => flags.gh && flags.downloads && flags.version
    );

    onBeforeMount(() => {
      axios.get(`${GITHUB_ENDPOINT}${props.repo}`).then(response => {
        const data = response.data;
        name.value = data.name;
        description.value = data.description;
        watchers.value = data.subscribers_count;
        stars.value = data.stargazers_count;
        forks.value = data.forks_count;
        issues.value = data.open_issues_count;
        flags.gh = true;
      });

      axios
        .get(
          `https://api.npmjs.org/downloads/point/${props.createDate}:${format(
            new Date(),
            "yyyy-MM-dd"
          )}/${props.repo}`
        )
        .then(response => {
          downloads.value = response.data.downloads;
          flags.downloads = true;
        });

      axios
        .get(
          `https://raw.githubusercontent.com/arthurvasconcelos/${props.repo}/master/package.json`
        )
        .then(response => {
          version.value = response.data.version;
          flags.version = true;
        });
    });

    return {
      name,
      description,
      watchers,
      stars,
      forks,
      issues,
      version,
      downloads,
      flags,
      isLoaded
    };
  }
});
</script>

<style lang="scss">
@import "../styles/functions";
@import "../styles/variables";
@import "../styles/mixins";

.project {
  width: 100%;
  box-shadow: 3px 3px 5px -2px rgba(0, 0, 0, 0.75);
  padding: 0.5em;
  position: relative;
  box-sizing: border-box;
}

.project-loading {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.65);
  color: #ffffff;
  display: flex;
  font-size: 40px;
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

  &.is-loaded {
    opacity: 0;
    visibility: hidden;
  }
}

.project-body {
  display: grid;
  grid-row-gap: 10px;
  grid-template-columns: 1fr;
  grid-template-rows: 45px auto 64px 46px;
  height: 100%;
}

.project-name {
  margin: 0;
}

.project-description {
  margin: 0;
}

.statList {
  display: grid;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  list-style: none;
  margin: 0;
  padding: 0;
}

// .statList-item {}

.statList-link {
  @include applyFont(mono);
  text-decoration: none;
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 2px 5px;
  background-color: #333333;
  color: #dddddd;

  &:hover {
    color: #ffffff;
  }
}

.statList-item-value {
  font-size: 18px;
  padding-left: 5px;
}

.installCommand {
  font-size: 12px;
  background-color: #d6d6d6;
  border-radius: 3px;
  padding: 16px;
}
</style>
