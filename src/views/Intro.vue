<template>
  <div class="intro" ref="intro">
    <div class="starsContainer" ref="starsContainer">
      <div class="stars"></div>
      <div class="stars2"></div>
      <div class="stars3"></div>
    </div>

    <div class="welcome">
      <div class="title">
        <h1>Arthur Vasconcelos</h1>
        <h2>
          Developing for&nbsp;
          <span class="changeWord" :class="currentClass"
            >{{ currentWord }}<span class="cursor">_</span></span
          >
          <span class="phraseBreaker"></span>
          &nbsp;with&nbsp;
          <span class="jsColor">JavaScript</span>
        </h2>
      </div>
    </div>

    <div class="githubHosted">
      Proudly hosted by
      <a href="https://github.com" target="_blank"
        ><img
          src="../assets/images/fixed-gh-logo.png"
          alt="GitHub • Social coding"
      /></a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { bus } from "@/bus";

export default defineComponent({
  name: "Intro",
  setup() {
    const currentWord = ref("");
    const currentClass = ref("");
    const words = ref(["web", "mobile", "desktop", "server"]);
    const intro = ref<HTMLDivElement | null>(null);
    const starsContainer = ref<HTMLDivElement | null>(null);

    function write(nextIndex: number, delay: number, callback: () => void) {
      const wordLetters = words.value[nextIndex].split("");
      const assembleWord: string[] = [];
      const interval = setInterval(() => {
        if (wordLetters.length > 0) {
          assembleWord.push(wordLetters[0]);
          wordLetters.shift();
          currentWord.value = assembleWord.join("");
        } else {
          clearInterval(interval);
          callback();
        }
      }, delay);
    }

    function erase(delay: number, callback: () => void) {
      const wordLetters = currentWord.value.split("");
      const interval = setInterval(() => {
        if (wordLetters.length > 0) {
          wordLetters.pop();
          currentWord.value = wordLetters.join("");
        } else {
          clearInterval(interval);
          callback();
        }
      }, delay);
    }

    function wordsInterval(delay = 1500) {
      const currentIndex = words.value.indexOf(currentWord.value);
      const nextIndex =
        currentIndex + 1 > words.value.length - 1 ? 0 : currentIndex + 1;

      setTimeout(() => {
        erase(100, () => {
          currentClass.value = words.value[nextIndex];
          write(nextIndex, 100, () => {
            wordsInterval();
          });
        });
      }, delay);
    }

    onMounted(() => {
      currentWord.value = words.value[0];
      currentClass.value = words.value[0];
      wordsInterval();

      bus.on("windowResize", () => {
        // console.log(window.outerWidth);
        // console.log(window.outerHeight);
        if (intro.value && starsContainer.value) {
          intro.value.style.width = starsContainer.value.style.width = "100%";
          intro.value.style.height = starsContainer.value.style.height =
            "100vh";
        }
      });
    });

    onBeforeUnmount(() => {
      bus.off("windowResize", () => null);
    });

    return { currentWord, currentClass, words, intro, starsContainer };
  },
});
</script>

<style lang="scss">
@import "../styles/functions";
@import "../styles/variables";
@import "../styles/mixins";

.intro {
  height: 100vh;
  overflow: hidden;
}

.starsContainer {
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  height: 100%;
  overflow: hidden;
  position: absolute;
  width: 100%;
  z-index: 0;
}

.stars,
.stars2,
.stars3 {
  background: transparent;

  &::after {
    background: transparent;
    content: " ";
    left: 1000px;
    position: absolute;
    top: 2000px;
  }
}

.stars {
  animation: animStar 50s linear infinite;
  box-shadow: $shadows-small;
  height: 1px;
  width: 1px;

  &::after {
    box-shadow: $shadows-small;
    height: 1px;
    width: 1px;
  }
}

.stars2 {
  animation: animStar 100s linear infinite;
  box-shadow: $shadows-medium;
  height: 2px;
  width: 2px;

  &::after {
    box-shadow: $shadows-medium;
    height: 2px;
    width: 2px;
  }
}

.stars3 {
  animation: animStar 150s linear infinite;
  box-shadow: $shadows-big;
  height: 3px;
  width: 3px;

  &::after {
    box-shadow: $shadows-big;
    height: 3px;
    width: 3px;
  }
}

.welcome {
  display: grid;
  height: 100%;
  position: relative;
  z-index: 1;
}

.title {
  align-self: center;
  display: grid;
  height: auto;
  text-align: center;

  h1 {
    @include applyFont($weight: 700);
    color: #ffffff;
    font-size: 2rem;
    margin: 0 0 0.3125em;
    padding: 0 0.5em;
    text-transform: uppercase;
  }

  h2 {
    @include applyFont($type: aux);
    color: #ffffff;
    font-size: 1.2rem;
    margin: 0;
    padding: 0;
  }

  .changeWord {
    @include applyFont($type: mono);
    padding: 0.20832em 0.41665em;
    text-transform: capitalize;
    transition: background-color 0.5s ease-out;

    &.web {
      background-color: #e65126;
      color: #eeeff1;
    }

    &.mobile {
      background-color: #488aff;
      color: #ffffff;
    }

    &.desktop {
      background-color: #393c4b;
      color: #a9edfa;
    }

    &.server {
      background-color: #83cd29;
      color: #404137;
    }

    .cursor {
      animation: fadeCursor 0.5s ease-in-out infinite;
    }
  }

  .phraseBreaker {
    display: block;
    height: 0.8rem;
    width: 100%;
  }

  .jsColor {
    @include applyFont($type: mono);
    background-color: #f0db4f;
    color: #323330;
    display: inline-block;
    padding: 0.20832em 0.41665em;
  }
}

.githubHosted {
  @include applyFont($type: main, $weight: 200);
  align-items: center;
  bottom: 15px;
  color: #dddddd;
  display: flex;
  font-size: 0.7rem;
  position: fixed;
  right: 15px;
  z-index: 1;

  a {
    align-items: center;
    display: flex;
    margin-left: 5px;
    padding: 1px;

    &:hover {
      img {
        opacity: 1;
      }
    }
  }

  img {
    border: 0;
    // max-width: 100%;
    opacity: 0.8;
    position: relative;
    transition: opacity 0.2s ease-in;
    width: 80px;
  }
}

// Media Queries

@include mediaQueries(XS) {
  .title {
    h1 {
      font-size: 2.5rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }
}

@include mediaQueries(M) {
  .title {
    h1 {
      font-size: 3rem;
    }

    .phraseBreaker {
      display: none;
    }
  }

  .githubHosted {
    font-size: 0.9375rem;

    img {
      width: 100px;
    }
  }
}

// Keyframes

@keyframes animStar {
  from {
    transform: translate(0px, 0px);
  }

  to {
    transform: translate(-1000px, -2000px);
  }
}

@keyframes fadeCursor {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
