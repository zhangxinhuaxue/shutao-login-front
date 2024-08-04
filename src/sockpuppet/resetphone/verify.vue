<template>
    <m-page>
        <p class="tip">为了您的账户安全，请选择一种方式进行身份验证</p>
        <m-cell-group>
            <m-cell title="刷脸验证" is-link @click="goFaceVerify()"> </m-cell>
        </m-cell-group>
    </m-page>
</template>
<script>
export default {
    name: 'sockpuppet-resetphone-verify',
    data() {
        return {
            faceUrl: this.$route.query.faceUrl
        }
    },
    methods: {
        goFaceVerify() {
            if (this.faceUrl) {
                const url = decodeURIComponent(this.faceUrl)
                window.location.href = url
            } else {
                window.history.go(-1)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/module/style.scss';
.tip {
    padding: px2rem(28) 0 0 px2rem(32);
    font-size: px2rem(24);
    line-height: px2rem(24);
    color: #999999;
}
</style>
