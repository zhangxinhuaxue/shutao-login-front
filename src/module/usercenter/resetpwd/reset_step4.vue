<template>
    <div class="page_login page_uc__sms">
        <basicPage :type="'password'" :titleInfo="titleInfo" :btn="btn" :warnInfo="warnInfo" @complete="goNext"></basicPage>
    </div>
</template>
<script>
import { resetPwdConfirm } from 'src/api/ucenter'
import {
    getEncryptedPsw,
    getCookie
} from 'src/libs/utils'
import { commonMixin } from 'src/module/common/common_mixin'

export default {
    name: 'loginSms',
    mixins: [commonMixin],
    data() {
        return {
            titleInfo: {
                doNeed: true,
                main: '确认新密码',
                sub: '请再次输入您设置的登录密码'
            },
            btn: {
                doNeed: true,
                txt: '完成'
            },
            phoneNo: this.$route.query.phoneNo,
            password: this.$route.query.password,
            source: this.$route.query.source || 'resetPwd',
            nfrom: this.$route.query.nfrom || 'h5'
        }
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
        goNext(data) {
            if (getEncryptedPsw(data) !== this.password) {
                this.warn('两次密码不一致，请重新输入')
                return
            }

            let ecryptedPwd = getEncryptedPsw(data)

            resetPwdConfirm({
                source: this.source,
                phoneNo: this.phoneNo,
                password: ecryptedPwd,
                channel: this.$route.query.channel
            }).then((res) => {
                if (res.success) {
                    let ticket = getCookie('cat') || ''
                    // app下通知原生已登录
                    if (this.isApp) {
                        // let method = this.nfrom === 'app_h5' ? 'forward' : 'backData'
                        window.JSBridge.callNative({
                            module: 'Public', // 模块名
                            method: 'backData', // 方法名
                            params: {
                                success: true,
                                data: {
                                    // 业务数据结构
                                    source: 'resetPwd',
                                    token: ticket
                                }
                            }
                        })
                    }
                    // app下backData协议会关闭页面，不需要处理回调
                    if (!(this.isApp && this.nfrom !== 'app_h5')) {
                        // 充值后默认登录，直接回到回调地址
                        let returnUrl = this.$route.query.cbUrl
                        if (returnUrl) {
                            window.location.href = returnUrl
                        } else {
                            this.$_toast('账号重置成功，请退出后重新进入')
                        }
                    }
                } else {
                    this.warn(res.resultDes || this.ERRORTXT)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
