<template>
  <div class="about-me">
    <PageHeader title="About Me"></PageHeader>
    <PageContent class="aboutMe">
      <img src="../assets/images/profile.jpg" alt="arthur vasconcelos profile pricture" class="aboutMe-profilePicture">
      <p class="aboutMe-description">I'm an organized and dedicated professional, compromised with the quality of the code and the final product. I’m passionate about my work and I'm always looking forward to learn new things and improve on the ones that I already know.</p>
      <ul class="aboutMe-socialList">
        <li class="aboutMe-socialList-item" v-for="(social, index) in filterBy(socials, 'show', true)" :key="`social-${index}`">
          <a
            class="aboutMe-socialList-link"
            :href="social.link" target="_blank"
            :style="{ color: (social.isHovered || $root.isMobile()) ? social.color : null }"
            @mouseover="mouseOverOutSocial($event, social)"
            @mouseout="mouseOverOutSocial($event, social)">
            <FontAwesomeIcon :icon="social.iconName" />
          </a>
        </li>
      </ul>
      <h2 class="subHeadline"><span>Skills</span></h2>
      <SkillGauge name="haskell"></SkillGauge>
      <SkillGauge name="php" :value="87"></SkillGauge>
      <SkillGauge name="javascript" :value="100"></SkillGauge>
      <SkillGauge name="python" :value="28"></SkillGauge>
      <SkillGauge name="c#" :value="50"></SkillGauge>
    </PageContent>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader.vue";
import PageContent from "@/components/PageContent.vue";
import SkillGauge from "@/components/SkillGauge.vue";

export default {
  name: "AboutMe",
  components: { PageHeader, PageContent, SkillGauge },
  data() {
    return {
      socials: [
        {
          link: "https://facebook.com/vasconcelos.arthur",
          iconName: ["fab", "facebook-f"],
          color: "#3B579D",
          show: false,
          isHovered: false
        },
        {
          link: "https://twitter.com/jookeringa",
          iconName: ["fab", "twitter"],
          color: "#00ACEE",
          show: false,
          isHovered: false
        },
        {
          link: "https://linkedin.com/in/arthurvasconcelos/",
          iconName: ["fab", "linkedin-in"],
          color: "#0A75B5",
          show: true,
          isHovered: false
        },
        {
          link: "https://github.com/arthurvasconcelos",
          iconName: ["fab", "github-alt"],
          color: "#171515",
          show: true,
          isHovered: false
        },
        {
          link: "https://bitbucket.org/alfv89/",
          iconName: ["fab", "bitbucket"],
          color: "#2684FF",
          show: false,
          isHovered: false
        },
        {
          link: "https://codepen.io/arthurvasconcelos/",
          iconName: ["fab", "codepen"],
          color: "#303C42",
          show: true,
          isHovered: false
        },
        {
          link: "https://jsfiddle.net/user/arthurvasconcelos",
          iconName: ["fab", "jsfiddle"],
          color: "#4679A4",
          show: false,
          isHovered: false
        },
        {
          link: "https://www.npmjs.com/~arthurvasconcelos",
          iconName: ["fab", "npm"],
          color: "#CB3837",
          show: true,
          isHovered: false
        },
        {
          link: "https://keybase.io/avasconcelos",
          iconName: ["fab", "keybase"],
          color: "#FF6F21",
          show: false,
          isHovered: false
        },
        {
          link: "https://stackoverflow.com/users/3130385/arthur-vasconcelos",
          iconName: ["fab", "stack-overflow"],
          color: "#F48024",
          show: true,
          isHovered: false
        },
        {
          link: "https://www.twitch.tv/jokeringa",
          iconName: ["fab", "twitch"],
          color: "#6441A4",
          show: false,
          isHovered: false
        },
        {
          link: "https://www.reddit.com/user/jookeringa",
          iconName: ["fab", "reddit-alien"],
          color: "#FF4500",
          show: false,
          isHovered: false
        }
        // {
        //     link: '#',
        //     iconName: ['fab', 'github-alt'],
        //     color: '#f00',
        //     show: false,
        //     isHovered: false
        // }
      ]
    };
  },
  methods: {
    filterBy(iterable, property, value) {
      return iterable.filter(item => item[property] === value);
    },
    mouseOverOutSocial(event, target) {
      if (!this.isMobile()) {
        if (event.type === "mouseover") {
          target.isHovered = true;
        } else if (event.type === "mouseout") {
          target.isHovered = false;
        }
      }
    }
  }
};
</script>

<style lang="scss">
@import "../styles/functions";
@import "../styles/variables";
@import "../styles/mixins";

.aboutMe-profilePicture {
  display: block;
  margin: 0 auto 0.5em;
  max-width: 320px;
  width: 100%;
}

.aboutMe-description {
  margin: 0;
}

.aboutMe-socialList {
  align-content: center;
  align-items: center;
  display: grid;
  grid-row-gap: 0.5rem;
  // grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  grid-template-columns: repeat(5, 50px);
  grid-template-rows: auto;
  justify-content: center;
  justify-items: center;
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
}

.aboutMe-socialList-item {
  place-self: stretch;
}

.aboutMe-socialList-link {
  align-items: center;
  color: #323232;
  display: grid;
  height: 100%;
  justify-items: center;
  transition: color 0.3s ease-in-out;
  width: 100%;
}

.subHeadline {
  align-items: center;
  clear: both;
  display: flex;
  font-size: 2rem;
  margin: 0.5em 0 0;

  &::before,
  &::after {
    background-color: #323232;
    content: "";
    display: inline-block;
    height: 1px;
    width: 100%;
  }

  span {
    margin: 0 0.5em;
  }
}

@include mediaQueries(M) {
  .aboutMe-profilePicture {
    float: left;
    margin: 0 0.5em 0.5em 0;
  }
}

@include mediaQueries(L) {
  .aboutMe-socialList {
    margin: 1.5rem 0 0;
  }
}

@include mediaQueries(XL) {
  .aboutMe-socialList {
    margin: 2rem 0 0;
  }
}
</style>
