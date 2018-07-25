<template>
    <nav class="mainNavigation">
        <ul>
            <li>
                <a href="#">About Me</a>
            </li>
        </ul>
    </nav>
</template>

<script>
    export default {
        name: 'navigation',
        data () {
            return {}
        }
    }
</script>

<style lang="scss">
    .mainNavigation {
        box-sizing: border-box;
        padding: 0 5px;
        position: fixed;
        width: 100%;

        ul {
            align-items: center;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            list-style: none;
            margin: 0;
            padding: 0;
            width: 100%;
        }

        a {
            display: block;
            padding: 5px 10px;
        }
    }
</style>