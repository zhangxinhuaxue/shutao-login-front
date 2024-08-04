<template>
    <sms-page :warnInfo="warnInfo" @complete="goNext">
    </sms-page>
</template>
<script>
import { updatePhoneNo } from 'src/api/ucenter'
import smsPage from '../common/smspage.vue'
import { commonMixin } from 'src/module/common/common_mixin'
import {
    getCookie
} from 'src/libs/utils'

export default {
    name: 'loginSmsCheck',
    mixins: [commonMixin],
    data() {
        return {
            phoneNoOld: this.$route.query.phoneNoOld,
            phoneNoNew: this.$route.query.phoneNo,
            source: this.$route.query.source || 'resetPhone',
            nfrom: this.$route.query.nfrom || 'h5'
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
            // 已校验数据可直接使用
            // console.log('>>>新手机号验证码是：', data)

            updatePhoneNo({
                phoneNo: this.phoneNoOld,
                phoneNoNew: this.phoneNoNew,
                smsCode: data,
                source: this.source,
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
                                    source: 'resetPhone',
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
