<template>
    <div id="app" :style="globalColor">
        <router-view />
        <!-- <router-view name="floor"></router-view> -->
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    computed: mapState({
        globalColor: (state) => state.globalColor
    })
}
</script>

<style lang="less">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #333333;
    background: #f6f6f6;
    font-size: 14px;
    height: 100vh;
}
</style>
