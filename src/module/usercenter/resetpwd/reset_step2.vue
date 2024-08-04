<template>
    <sms-page :source="'resetPwd'" :warnInfo="warnInfo" @complete="goNext">
        <p slot="other" class="float_bottom" @click="goVerify">
            原手机号已不能接收短信？
        </p>
    </sms-page>
</template>
<script>
import smsPage from '../common/smspage.vue'
import { checkSmsCode } from 'src/api/ucenter'
import { commonMixin } from 'src/module/common/common_mixin'
export default {
    name: 'loginSmsCheck',
    mixins: [commonMixin],
    data() {
        return {
            phoneNo: this.$route.query.phoneNo,
            source: 'resetPwd'
        }
    },
    computed: {},
    components: {
        smsPage
    },
    created() {},
    mounted() {},
    methods: {
        goNext(data) {
            // console.log('>>>返回的验证码是：', data)
            checkSmsCode({
                source: this.source,
                phoneNo: this.phoneNo,
                smsCode: data
            }).then((res) => {
                if (res.success) {
                    this.$router.push({
                        name: 'resetPwdStep3',
                        query: {
                            ...this.$route.query,
                            phoneNo: this.phoneNo
                        }
                    })
                } else {
                    this.warn(res.resultDes || this.ERRORTXT)
                }
            })
        },
        goVerify() {
            this.$router.replace({
                name: 'channels',
                query: {
                    ...this.$route.query,
                    verifySource: 'resetPwd'
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
