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
          <a class="statList-link" :href="`https://github.com/arthurvasconcelos/${ name }/watchers`" target="_blank" title="Watchers">
            <FontAwesomeIcon :icon="['fas', 'eye']" />
            <span class="statList-item-value">{{ watchers }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a class="statList-link" :href="`https://github.com/arthurvasconcelos/${ name }/stargazers`" target="_blank" title="Stars">
            <FontAwesomeIcon :icon="['fas', 'star']" />
            <span class="statList-item-value">{{ stars }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a class="statList-link" :href="`https://github.com/arthurvasconcelos/${ name }/network/members`" target="_blank" title="Forks">
            <FontAwesomeIcon :icon="['fas', 'code-branch']" />
            <span class="statList-item-value">{{ forks }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a class="statList-link" :href="`https://github.com/arthurvasconcelos/${ name }/issues`" target="_blank" title="Issues">
            <FontAwesomeIcon :icon="['fas', 'exclamation-circle']" />
            <span class="statList-item-value">{{ issues }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a class="statList-link" :href="`https://github.com/arthurvasconcelos/${ name }`" target="_blank" title="Version">
            <FontAwesomeIcon :icon="['fas', 'code']" />
            <span class="statList-item-value">{{ version }}</span>
          </a>
        </li>

        <li class="statList-item">
          <a class="statList-link" :href="`https://www.npmjs.com/package/${ name }`" target="_blank" title="Downloads">
            <FontAwesomeIcon :icon="['fas', 'cloud-download-alt']" />
            <span class="statList-item-value">{{ downloads }}</span>
          </a>
        </li>
      </ul>

      <code class="installCommand">npm install --save {{ name }}</code>
    </div>
  </div>
</template>

<script>
import moment from "moment";

const GITHUB_ENDPOINT = "https://api.github.com/repos/arthurvasconcelos/";

export default {
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
  data() {
    return {
      name: "",
      description: "",
      watchers: 0,
      stars: 0,
      forks: 0,
      issues: 0,
      version: 0,
      downloads: 0,
      flags: {
        gh: false,
        downloads: false,
        version: false
      }
    };
  },
  computed: {
    isLoaded() {
      return this.flags.gh && this.flags.downloads && this.flags.version;
    }
  },
  beforeMount() {
    this.$http.get(`${GITHUB_ENDPOINT}${this.repo}`).then(response => {
      const data = response.data;
      this.name = data.name;
      this.description = data.description;
      this.watchers = data.subscribers_count;
      this.stars = data.stargazers_count;
      this.forks = data.forks_count;
      this.issues = data.open_issues_count;
      this.flags.gh = true;
    });

    this.$http
      .get(
        `https://api.npmjs.org/downloads/point/${
          this.createDate
        }:${moment().format("YYYY-MM-DD")}/${this.repo}`
      )
      .then(response => {
        this.downloads = response.data.downloads;
        this.flags.downloads = true;
      });

    this.$http
      .get(
        `https://raw.githubusercontent.com/arthurvasconcelos/${
          this.repo
        }/master/package.json`
      )
      .then(response => {
        this.version = response.data.version;
        this.flags.version = true;
      });
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss">
@import "../styles/functions";
@import "../styles/variables";
@import "../styles/mixins";

.project {
  width: 300px;
  box-shadow: 3px 3px 5px -2px rgba(0, 0, 0, 0.75);
  padding: 0.5em;
  position: relative;
  margin: 0.5em;
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
  display: flex;
  flex-direction: column;
}

.project-name {
  margin: 0;
}

.project-description {
  height: 125px;
  margin: 0;
}

.statList {
  list-style: none;
  display: flex;
  margin: -5px;
  padding: 0;
  // justify-content: center;
  flex-wrap: wrap;
}

.statList-item {
  margin: 5px;
}

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
  margin-top: 10px;
  background-color: #d6d6d6;
  border-radius: 3px;
  padding: 16px;
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
