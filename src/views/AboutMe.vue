<template>
  <div class="about-me">
    <PageHeader title="About Me"></PageHeader>
    <PageContent class="aboutMe">
      <img src="../assets/images/profile.jpg" alt="arthur vasconcelos profile pricture" class="aboutMe-profilePicture">
      <div class="aboutMe-description">
        <p>HEY YOU,</p>
        <p>I'm Arthur Vasconcelos, a {{ myAge() }}-year old nerd living in São Paulo. I love being a developer and learning new stuff! I currently work at the {{ experiences[0].name }} but I'm always involved in Open Source or freelance projects in my spare time.</p>
        <p>Also I have 7 years of experience as a developer and my main focus is in frontend development and user interface coding, where I have a strong knowledge of Javascript and its tools and frameworks but I can develop on the server side too, I can write code in PHP, Javascript and Python.</p>
      </div>
      <ul class="aboutMe-socialList">
        <li class="aboutMe-socialList-item" v-for="(social, sIndex) in filterBy(socials, 'show', true)" :key="`social-${sIndex}`">
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
      <div class="skillGrid">
        <SkillBar :name="skill.name" :value="skill.knwl" v-for="(skill, sklIndex) in skills" :key="`skill-${sklIndex}`"></SkillBar>
      </div>

      <h2 class="subHeadline"><span>Experiences</span></h2>
      <div class="experienceGrid">
        <div class="experienceGrid-item" v-for="(experience, expIndex) in experiences" :key="`experience-${expIndex}`">
          <div class="experienceGrid-item-cover">
            <img :src="require(`../assets/images/companies/${experience.logo}`)" />
          </div>
          <div class="experienceGrid-item-data">
            <div class="experienceGrid-item-data-header">
              <h2>{{ experience.role }} @ {{ experience.name }}</h2>
              <small>{{ getMonthYear(experience.join) }} – {{ getMonthYear(experience.leave) }} ({{ jobDuration(experience.join, experience.leave) }})</small>
            </div>
            <p class="experienceGrid-item-data-description">{{ experience.description }}</p>
          </div>
        </div>
      </div>
    </PageContent>
  </div>
</template>

<script>
import moment from "moment";
import PageHeader from "@/components/PageHeader.vue";
import PageContent from "@/components/PageContent.vue";
import SkillGauge from "@/components/SkillGauge.vue";
import SkillBar from "@/components/SkillBar.vue";

export default {
  name: "AboutMe",
  components: { PageHeader, PageContent, SkillGauge, SkillBar },
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
          link: "https://bitbucket.org/arthurvasconcelos/",
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
          show: true,
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
      ],
      skills: [
        {
          name: "HTML",
          knwl: 100
        },
        {
          name: "CSS",
          knwl: 100
        },
        {
          name: "SASS",
          knwl: 80
        },
        {
          name: "LESS",
          knwl: 60
        },
        {
          name: "Javascript",
          knwl: 100
        },
        {
          name: "VueJS",
          knwl: 85
        },
        {
          name: "Angular",
          knwl: 65
        },
        {
          name: "EmberJS",
          knwl: 75
        },
        {
          name: "PHP",
          knwl: 80
        },
        {
          name: "Laravel",
          knwl: 70
        },
        {
          name: "Symfony",
          knwl: 45
        },
        {
          name: "Python",
          knwl: 30
        }
        // {
        //   name: "",
        //   knwl: 0
        // },
      ],
      experiences: [
        {
          name: "Igarapé Institute",
          logo: "igarape_en_block.png",
          role: "Software Developer",
          description:
            "Responsible for the development of web, desktop and mobile applications, data visualizations and interfaces for internal tools.",
          join: "2016-04-01",
          leave: null
        },
        {
          name: "FGV DAPP",
          logo: "fgv-dapp.png",
          role: "Fullstack Developer",
          description:
            "Responsible for the development of interfaces and tools for data processing, server management and maintenance.",
          join: "2014-07-01",
          leave: "2016-02-01"
        },
        {
          name: "Piloti",
          logo: "piloti.png",
          role: "Fullstack Developer",
          description:
            "Responsible for the development of interfaces and systems using the Symfony framework. ",
          join: "2013-03-01",
          leave: "2014-06-01"
        }
        // {
        //   name: "",
        //   logo: "",
        //   role: "",
        //   description: "",
        //   join: "",
        //   leave: ""
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
    },
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

.aboutMe-profilePicture {
  display: block;
  margin: 0 auto 0.5em;
  max-width: 320px;
  width: 100%;
}

.aboutMe-description {
  margin: 0;

  p {
    margin: 0 0 15px 0;

    &:last-child {
      margin: 0;
    }
  }
}

.aboutMe-socialList {
  align-content: center;
  align-items: center;
  display: grid;
  grid-row-gap: 0.5rem;
  // grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  grid-template-columns: repeat(6, 50px);
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

.skillGrid {
  display: grid;
  grid-column-gap: 25px;
  grid-row-gap: 25px;
  grid-template-columns: 1fr;
  margin-top: 0.5em;
}

.experienceGrid {
  display: grid;
  grid-column-gap: 25px;
  grid-row-gap: 25px;
  grid-template-columns: 1fr;
  margin-top: 0.5em;
}

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

@include mediaQueries(M) {
  .aboutMe-profilePicture {
    float: left;
    margin: 0 0.5em 0.5em 0;
  }

  .skillGrid {
    grid-template-columns: 1fr 1fr;
  }

  .experienceGrid {
    grid-template-columns: 1fr 1fr;
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
