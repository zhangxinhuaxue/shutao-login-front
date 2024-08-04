<template>
    <sms-page :warnInfo="warnInfo" @complete="goNext">
        <p slot="other" class="float_bottom" @click="goVerify">
            原手机号已不能接收短信？
        </p>
    </sms-page>
</template>
<script>
import { checkSmsCode } from 'src/api/ucenter'
import smsPage from '../common/smspage.vue'
import { commonMixin } from 'src/module/common/common_mixin'
export default {
    name: 'loginSmsCheck',
    mixins: [commonMixin],
    data() {
        return {
            phoneNo: this.$route.query.phoneNo,
            source: 'resetPhone'
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
            checkSmsCode({
                source: this.source,
                phoneNo: this.phoneNo,
                smsCode: data
            }).then((res) => {
                if (res.success) {
                    this.$router.push({
                        name: 'resetPhoneStep3',
                        query: this.$route.query
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
                    verifySource: 'resetPhone'
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/module/style.scss';
</style>
