<template>
    <div class="intro">
        <div class="startsContainer">
            <div class="stars"></div>
            <div class="stars2"></div>
            <div class="stars3"></div>
        </div>

        <div class="welcome">
            <div class="title">
                <h1>Arthur Vasconcelos</h1>
                <h2>
                    Developing for&nbsp;
                    <span class="changeWord" :class="currentClass">{{ currentWord }}<span class="cursor">_</span></span>
                    <span class="phraseBreaker"></span>
                    &nbsp;with&nbsp;
                    <span class="jsColor">JavaScript</span>
                </h2>
            </div>
        </div>

        <div class="githubHosted">
            Proudly hosted by
            <a href="https://github.com" target="_blank"><img src="../assets/images/fixed-gh-logo.png" alt="GitHub • Social coding"></a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'intro',
        data() {
            return {
                currentWord: '',
                currentClass: '',
                words: [
                    'web',
                    'mobile',
                    'desktop',
                    'server'
                ]
            };
        },
        mounted() {
            this.currentWord = this.words[0];
            this.currentClass = this.words[0];
            this.wordsInterval();
        },
        methods: {
            wordsInterval(delay = 5000) {
                const currentIndex = this.words.indexOf(this.currentWord);
                const nextIndex = (currentIndex + 1 > this.words.length - 1) ? 0 : currentIndex + 1;

                setTimeout(() => {
                    this.erase(100, () => {
                        this.currentClass = this.words[nextIndex];
                        this.write(nextIndex, 100, () => {
                            this.wordsInterval();
                        });
                    })
                }, delay);
            },
            erase(delay, callback) {
                const wordLetters = this.currentWord.split('');
                const interval = setInterval(() => {
                    if (wordLetters.length > 0) {
                        wordLetters.pop();
                        this.currentWord = wordLetters.join('');
                    } else {
                        clearInterval(interval);
                        callback();
                    }
                }, delay);
            },
            write(nextIndex, delay, callback) {
                const wordLetters = this.words[nextIndex].split('');
                const assembleWord = [];
                const interval = setInterval(() => {
                    if (wordLetters.length > 0) {
                        assembleWord.push(wordLetters[0])
                        wordLetters.shift();
                        this.currentWord = assembleWord.join('');
                    } else {
                        clearInterval(interval);
                        callback();
                    }
                }, delay);
            }
        }
    }
</script>

<style lang="scss">
    @import '../styles/functions';
    @import '../styles/variables';
    @import '../styles/mixins';

    .intro {
        height: 100vh;
        overflow: hidden;
    }

    .startsContainer {
        background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
        height: 100%;
        overflow: hidden;
        position: absolute;
        width: 100%;
        z-index: -1;
    }

    .stars,
    .stars2,
    .stars3 {
        background: transparent;
    
        &::after {
            background: transparent;
            content: ' ';
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
    }

    .title {
        align-self: center;
        display: grid;
        height: auto;
        text-align: center;

        h1 {
            @include applyFont($weight: 700);
            color: #FFFFFF;
            font-size: 2rem;
            margin: 0 0 .3125em;
            padding: 0 .5em;
            text-transform: uppercase;
        }

        h2 {
            @include applyFont($type: aux);
            color: #FFFFFF;
            font-size: 1.2rem;
            margin: 0;
            padding: 0;
        }

        .changeWord {
            @include applyFont($type: mono);
            padding: .20832em .41665em;
            text-transform: capitalize;
            transition: background-color .5s ease-out;

            &.web {
                background-color: #E65126;
                color: #EEEFF1;
            }

            &.mobile {
                background-color: #488AFF;
                color: #FFFFFF;
            }

            &.desktop {
                background-color: #393C4B;
                color: #A9EDFA;
            }

            &.server {
                background-color: #83CD29;
                color: #404137;
            }

            .cursor {
                animation: fadeCursor .5s ease-in-out infinite;
            }
        }

        .phraseBreaker {
            display: block;
            height: .8rem;
            width: 100%;
        }

        .jsColor {
            @include applyFont($type: mono);
            background-color: #F0DB4F;
            color: #323330;
            display: inline-block;
            padding: .20832em .41665em;
        }
    }

    .githubHosted {
        @include applyFont($type: main, $weight: 200);
        align-items: center;
        bottom: 15px;
        color: #DDDDDD;
        display: flex;
        font-size: .7rem;
        position: fixed;
        right: 15px;

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
            opacity: .8;
            position: relative;
            transition: opacity .2s ease-in;
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
            font-size: .9375rem;

            img {
                width: 100px;
            }
        }
    }

    // Keyframes

    @keyframes animStar {
        from {
            transform: translate(0px, 0px)
        }

        to {
            transform: translate(-1000px, -2000px)
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