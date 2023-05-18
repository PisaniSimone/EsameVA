<template>
    <header>
        <b-navbar type="dark" variant="light">
            <b-navbar-brand href="#">NavBar</b-navbar-brand>
        </b-navbar>
    </header>
    <div id="app">
        <b-container>
            <b-row class="plots">
                <MC2_first_part></MC2_first_part>
            </b-row>
        </b-container>
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
    color: #2c3e50;
}

</style>
