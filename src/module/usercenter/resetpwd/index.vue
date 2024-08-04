<template>
    <div class="page_login page_uc__sms">
        <basicPage :titleInfo="titleInfo" :btn="btn" :warnInfo="warnInfo" @complete="goNext">
            <template slot="content_input">
                <input-ui
                    :isImageCode="true"
                    type="text"
                    :requestPath="requestPath"
                    :updateImgCode="updateImgCode"
                    @inputComplete="setImgCode"
                    :placeholder="'请输入图形验证码'">
                </input-ui>
            </template>
        </basicPage>
        <partProtocol :isBasicPro="true"></partProtocol>
    </div>
</template>
<script>
import {
    getPhoneToken,
    sendSmsCode
} from 'src/api/ucenter'
import { imgCodeMixin } from 'src/module/common/common_mixin'
export default {
    name: 'loginSms',
    mixins: [imgCodeMixin],
    data() {
        return {
            titleInfo: {
                doNeed: true,
                main: '忘记密码',
                sub: '请输入你要找回密码的手机号'
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
        goNext(val) {
            if (!this.checkImgCode()) {
                return
            }
            this.getTokenFun(val).then((token) => {
                return this.sendSmsCodeFun(val, token)
            }).then((token) => {
                this.$router.push({
                    name: 'resetPwdStep2',
                    query: {
                        ...this.$route.query,
                        phoneNo: val,
                        token
                    }
                })
            }).catch((res) => {
                if (res.code === '1002') {
                    this.warn('手机号不存在，请重新输入')
                } else {
                    this.warn(res.resultDes || this.ERRORTXT)
                }
            })
        },
        getTokenFun(val) {
            return new Promise((resolve, reject) => {
                let phoneNo = val
                getPhoneToken({
                    phoneNo,
                    imgCode: this.imgCode
                }).then((res) => {
                    if (res.success && res.result) {
                        resolve(res.result.token)
                    } else {
                        reject(res)
                    }
                })
            })
            // let phoneNo = val
            // getPhoneToken({
            //     phoneNo,
            //     imgCode: this.imgCode
            // }).then((res) => {
            //     if (res.success) {
            //         let token = res.result.token
            //         this.sendSmsCodeFun(phoneNo, token)
            //     } else {
            //         this.updateImgCodeFun()
            //         this.warn(res.resultDes || this.ERRORTXT)
            //     }
            // })
        },
        sendSmsCodeFun(phoneNo, token) {
            return new Promise((resolve, reject) => {
                sendSmsCode({
                    source: 'resetPwdInit',
                    phoneNo,
                    imgCode: this.imgCode
                }).then((res) => {
                    if (res.success) {
                        resolve(token)
                    } else {
                        reject(res)
                    }
                })
            })
            // sendSmsCode({
            //     source: 'resetPwdInit',
            //     phoneNo,
            //     imgCode: this.imgCode
            // }).then((res) => {
            //     if (res.success) {
            //         this.$router.push({
            //             name: 'resetPwdStep2',
            //             query: {
            //                 ...this.$route.query,
            //                 phoneNo,
            //                 token
            //             }
            //         })
            //     } else {
            //         if (res.code === '1002') {
            //             this.warn('手机号不存在，请重新输入')
            //         } else {
            //             this.warn(res.resultDes || this.ERRORTXT)
            //         }
            //     }
            // })
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
