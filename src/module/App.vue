<template>
    <transition name="fade">
        <router-view class="view"></router-view>
    </transition>
</template>
<script>
// import 'src/libs/vconsole.js'
export default {
    name: 'app'
}
</script>
<style lang="scss">
@import './style.scss';
html,
body {
    height: 100%;
    background: #fff;
}

body {
    width: 16rem;
    margin: 0 auto;
    position: relative;
}
</style>
