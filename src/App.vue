<template>
<!--    <header>
        <b-navbar type="dark" variant="danger" class="border-23 border-bottom border-dark">
            <b-navbar-brand href="#">NavBar</b-navbar-brand>
        </b-navbar>
    </header>-->
    <div id="app">

        <MC2_first_part></MC2_first_part>

    </div>
</template>

<script>

import MC2_first_part from "@/components/MC2_first_part.vue";


export default {
    name: 'App',
    components: {
        MC2_first_part
    }
}

</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    background-color: #EDF2F4;
}

</style>
