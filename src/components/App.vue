<template>
    <div id="app">
        <h1>{{ msg }}</h1>
        <div class="teste">testing <span class="bold">SCSS nest class</span></div>
    </div>
</template>

<script>
    export default {
        name: 'app',
        data () {
            return {
                msg: 'Hey Therea'
            }
        }
    }
</script>

<style lang="scss">
    body {
        font-family: Arial, Helvetica, sans-serif;
    }

    .teste {
        color: #323234;

        .bold {
            font-weight: bold;
            color: #f00;
        }
    }
</style>