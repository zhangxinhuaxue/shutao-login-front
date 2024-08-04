<template>
    <div class="page_login page_uc__sms">
        <basicPage :type="'password'" :titleInfo="titleInfo" :btn="btn" :warnInfo="warnInfo" @complete="goNext"></basicPage>
    </div>
</template>
<script>
import { testPwd } from 'src/libs/regs'
import { getEncryptedPsw } from 'src/libs/utils'
import { commonMixin } from 'src/module/common/common_mixin'
export default {
    name: 'loginSms',
    mixins: [commonMixin],
    data() {
        return {
            titleInfo: {
                doNeed: true,
                main: '设置新密码',
                sub: '请设置新的登录密码'
            },
            btn: {
                doNeed: true,
                txt: '下一步'
            }
        }
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
        goNext(data) {
            // console.log('>>>resetPwd step3 data: ' + data)
            if (!testPwd(data)) {
                data ? this.warn('请输入8-16位数字和字母组合') : this.warn('密码不可为空')
                return
            }

            this.$router.push({
                name: 'resetPwdStep4',
                query: {
                    ...this.$route.query,
                    password: getEncryptedPsw(data)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
