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
                    &nbsp;with&nbsp;
                    <span class="jsColor">JavaScript</span>
                </h2>
            </div>
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
    @import url('https://fonts.googleapis.com/css?family=Raleway:200,400,700');
    // font-family: 'Raleway', sans-serif;
    @import url('https://fonts.googleapis.com/css?family=Slabo+27px');
    // font-family: 'Slabo 27px', serif;
    @import url('https://fonts.googleapis.com/css?family=Source+Code+Pro:600');
    // font-family: 'Source Code Pro', monospace;

    @function multiple-box-shadow($n) {
        $value: '#{random(2000)}px #{random(2000)}px #FFF';

        @for $i from 2 through $n {
            $value: '#{$value} , #{random(2000)}px #{random(2000)}px #FFF';
        }

        @return unquote($value);
    }

    $shadows-small: multiple-box-shadow(700);
    $shadows-medium: multiple-box-shadow(200);
    $shadows-big: multiple-box-shadow(100);

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
            color: #FFFFFF;
            font-family: 'Raleway', sans-serif;
            font-size: 3em;
            font-weight: 700;
            margin: 15px;
            padding: 0;
            text-transform: uppercase;
        }

        h2 {
            color: #FFFFFF;
            font-family: 'Slabo 27px', serif;
            font-weight: 400;
            margin: 0;
            padding: 0;
        }

        .changeWord {
            font-family: 'Source Code Pro', monospace;
            font-weight: 600;
            padding: 5px 10px;
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

        .jsColor {
            background-color: #F0DB4F;
            color: #323330;
            display: inline-block;
            font-family: 'Source Code Pro', monospace;
            font-weight: 600;
            padding: 5px 10px;
        }
    }

    @keyframes animStar {
        from {
            transform: translateY(0px)
        }

        to {
            transform: translateY(-2000px)
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