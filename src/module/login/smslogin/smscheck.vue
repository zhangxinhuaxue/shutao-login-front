<template>
    <div class="page_login page_login__sms">
        <basic-page :type="'smscode'" :titleInfo="titleInfo" :btn="btnInfo" :warnInfo="warnInfo" @complete="goNext"></basic-page>
        <part-protocol :isBasicPro="false">
            <span class="protocol_left" slot="left">
                <!-- 没收到短信？您可<a class="link" href="javascript:;">语音获取</a> -->
            </span>
            <span slot="right" @click="resendSmsCode" class="color_ccc">
                {{countDownTxt}}
            </span>
        </part-protocol>
        <p class="float_bottom"  @click="goResetPhoneNo">
            手机号换了
        </p>
        <m-dialog ref="dialog_imgcode"
            :title="dialogTitle"
            :closeOnConfirm="false"
            @confirm="closeDialog">
            <div class="img_container">
                <span class="size_special"><input class="imgcode-input" maxLength="4" v-model="imgCode" type="text" placeholder="请输入验证码"></span>
                <img :src="imgCodeSrc" alt="" @click="setImgCode">
            </div>
        </m-dialog>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import {
    testTelphone,
    testImgCode
} from 'src/libs/regs'
import {
    sendCodeMsg,
    smsLogin,
    bindUser
} from 'src/api/login'
import {
    setCookie
} from 'src/libs/utils'
import {
    urlHandler
} from 'src/libs/domain.js'
import {
    goReset
} from '../common/commonfunc'
import { commonMixin } from 'src/module/common/common_mixin'
export default {
    name: 'loginSmsCheck',
    mixins: [commonMixin],
    data() {
        return {
            sourceType: this.$route.query.sourceType || 'smslogin',
            titleInfo: {
                doNeed: true,
                main: '输入验证码',
                sub: '已发送验证码至' + this.$route.query.phoneNo
            },
            btnInfo: {
                doNeed: false
            },
            phoneNo: this.$route.query.phoneNo,
            isCounting: false,
            countDownTxt: '获取验证码',
            currentCount: 60,
            imgCode: '', // 图形验证码
            imgCodeSrc: '',
            dialogTitle: '请输入校验码'
        }
    },
    computed: {
    },
    filters: {
        numFilter(val) {
            if (!val) {
                return ''
            } else {
                return val
            }
        }
    },
    created() {},
    mounted() {
        // let a = this.getLocation(this.$route.query.cbUrl).hostname
        // console.log(document.domain.match(/[^\.]+\.[^\.]+$/)[0], )
        this.countDown()
        // test TODO
        // this.$refs.dialog_imgcode.show()
    },
    methods: {
        getLocation(href) {
            let match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/)
            return match && {
                protocol: match[1],
                host: match[2],
                hostname: match[3],
                port: match[4],
                pathname: match[5],
                search: match[6],
                hash: match[7]
            }
        },
        countDown() {
            if (!this.isCounting) {
                this.isCounting = true
            }

            setTimeout(() => {
                if (this.currentCount) {
                    this.currentCount--
                    this.countDownTxt = '重新发送 (' + this.currentCount + 's)'
                    this.countDown()
                } else {
                    this.currentCount = 60
                    this.countDownTxt = '重新发送'
                    this.isCounting = false
                }
            }, 1000)
        },
        resendSmsCode() {
            if (!this.isCounting) {
                let smstype = 'reg'
                if (this.sourceType === 'wxBind') {
                    smstype = 'weixin'
                } else if (this.sourceType === 'qqBind') {
                    smstype = 'qq'
                }
                // this.log('validatelogon-button-verificationcode', '重新发送验证码')
                this.log({ type: 'button-logic', name: 'validatelogon-button-verificationcode' })

                sendCodeMsg({
                    source: this.sourceType,
                    smstype: smstype,
                    telphone: this.phoneNo,
                    imgCode: this.imgCode
                }).then((res) => {
                    if (res.success) {
                        this.countDown()
                    } else {
                        // 接口返回失败 先弹图形验证码 填写完成后在请求短信
                        this.setImgCode()
                        this.$refs.dialog_imgcode.show()
                    }
                })
            }
        },
        goNext(data) {
            // 短信登录接口
            // console.log('>>> smscheck page >> goNext >', data)
            let loginAjax = smsLogin
            if (this.sourceType !== 'smslogin') {
                loginAjax = bindUser
            }

            loginAjax({
                username: this.phoneNo,
                telphone: this.phoneNo,
                smsCode: data,
                imgCode: this.imgCode,
                channel: this.$route.query.channel,
                openid: this.$route.query.openId
            }).then((res) => {
                if (res.success) {
                    let ticket = res.result ? res.result.ticket : ''
                    let returnUrl = this.$route.query.cbUrl
                    let domain = document.domain.match(/[^\.]+\.[^\.]+$/) ? document.domain.match(/[^\.]+\.[^\.]+$/)[0] : ''
                    if (returnUrl) {
                        // 判断cbUrl是否含域名，如果没有域名表示相对地址，不能跳转，故停留在当前页
                        if (this.getLocation(returnUrl) && this.getLocation(returnUrl).hostname) {
                            let hostname = this.getLocation(returnUrl).hostname
                            if (hostname.match(/[^\.]+\.[^\.]+$/)) {
                                hostname = hostname.match(/[^\.]+\.[^\.]+$/)[0]
                                if (domain !== hostname) {
                                    // 回跳域名和主域名不相等时,读取服务端设置的cat的Cookies,拼接回调
                                    setTimeout(() => {
                                        let cat = Cookies.get('cat') || ''
                                        window.location.href = `${returnUrl}&cat=${cat}`
                                    }, 100)
                                } else {
                                    window.location.href = returnUrl
                                }
                            }
                        }
                    }
                } else {
                    if (res.code === '1001' && this.sourceType !== 'smslogin') {
                        this.$createDialog({
                            content: '此手机号已绑定其他微信账号，请更换其他手机号',
                            onConfirm: () => {
                                // 手机号已绑定后续逻辑
                                // 进入这里的都是绑定流程，手机号已绑就返回上一页
                                this.$router.go(-1)
                            }
                        }).show()
                    } else {
                        this.warn(res.resultDes || this.ERRORTXT)
                    }
                }
            })
        },
        goResetPhoneNo() {
            this.log({ type: 'button-link', name: 'validatelogon-button-forget' })
            goReset()
        },
        setImgCode() {
            this.imgCodeSrc = urlHandler('/login/vcode?time=' + +new Date())
            this.imgCode = ''
        },
        closeDialog() {
            if (!testImgCode(this.imgCode)) {
                this.imgCode ? (this.dialogTitle = '请输入4位有效验证码') : (this.dialogTitle = '验证码不可为空')
                return
            }

            this.$refs.dialog_imgcode.hide()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
.color_ccc {
    color: #ccc;
}

.img_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .size_special {
        width: px2rem(280);
        background: #F7F7F7;
        padding: px2rem(18) px2rem(10);
        .imgcode-input {
            border: 0;
            font-size: px2rem(28);
            background: transparent;
            color: $colorTextMain;
            display: block;
        }
    }
    img {
        display: inline-block;
        width: px2rem(190);
        height: px2rem(70);
    }
}

</style>
