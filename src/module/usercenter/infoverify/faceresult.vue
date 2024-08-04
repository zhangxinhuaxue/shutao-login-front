<template>
    <m-page :loading="isLoading"></m-page>
</template>
<script>
import {
    getFaceCheckResult
} from 'src/api/ucenter'
export default {
    name: '',
    data() {
        return {
            isLoading: true,
            failReason: ''
        }
    },
    computed: {
    },
    created() {
    },
    mounted() {
        this.initData()
    },
    methods: {
        initData() {
            getFaceCheckResult({
                orderId: this.$route.query.orderId || ''
            }).then((res) => {
                if (res.success) {
                    // 身份验证后根据来源跳转到重置手机号的第三步
                    this.$router.push({
                        name: 'resetPhoneStep3',
                        query: {
                            ...this.$route.query,
                            source: 'fromFace',
                            phoneNo: res.resultDes
                        }
                    })
                } else {
                    window.history.go(-2)
                }
            }).catch((err) => {
                // console.log('err', err)
                window.history.go(-2)
            })
        },
        goBack() {
            window.history.go(-2)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../style.scss';
.img_err {
    width: px2rem(260);
    height: px2rem(380);
    margin: px2rem(180) auto px2rem(50);
}
h3 {
    text-align: center;
    font-size: px2rem(40);
}
.btn_back {
    width: px2rem(240);
    height: px2rem(100);
    margin: px2rem(50) auto;
    font-size: px2rem(36);
    line-height: px2rem(100);
    text-align: center;
    border: 1px solid #fec106;
    border-radius: px2rem(50);
}
</style>
