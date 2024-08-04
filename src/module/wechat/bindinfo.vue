<!--
    heioray 2018/03/16 UI改造MUI
-->
<template>
    <m-page class="page_smslogin">
        <img :src="banner" alt="">
        <m-cell-group cell-type="form" class="mt0 line_under">
            <m-input
                native-type="tel"
                ref="tel"
                v-model.trim="form.telphone"
                placeholder="请输入手机号"
                :maxlength="11">
                <img slot="ft"
                v-if="form.telphone"
                :src="closeBtn"
                @click="clearUsername"
                style="width: 20px; margin-right: 5px; display: block;">
            </m-input>
            <m-input
                native-type="tel"
                v-model.trim="form.smsCode"
                placeholder="请输入短信验证码"
                input-type="vcode"
                :maxlength="6"
                :isTiming="isTiming"
                @getCode="getCode">
            </m-input>
            <m-input
                v-if="imgCodeVisible"
                v-model.trim="form.imgCode"
                placeholder="请输入验证码"
                input-type="vcode">
                <img slot="ft"
                    :src="imgCodeSrc"
                    alt=""
                    class="mui-vcode__img"
                    @click="getImgCode">
            </m-input>
        </m-cell-group>
        <div class="aui-protocol">
            同意
            <a :href="regProto">《爱又米用户注册协议》</a>
        </div>
        <m-button class="border10" :disabled="disable" @click="submit">登录</m-button>
    </m-page>
</template>
<script>
import {
    smsLogin,
    sendCodeMsg,
    bindUser,
    renderData
} from 'src/api/login'
import {
    testTelphone,
    testVcode,
    testImgCode,
    regProto
} from 'src/libs/regs'
import {
    urlHandler
} from 'src/libs/domain.js'
import {
    cmsBannerMixin
} from './cms_mixin'
import {
    setCookie
} from 'src/libs/utils'
export default {
    name: 'smslogin',
    data() {
        return {
            closeBtn: require('../images/cloese@2x.png'),
            regProto: regProto,
            smstype: 'sms_login',
            imgCodeVisible: false,
            isTiming: false,
            imgCodeSrc: '',
            form: {
                username: '',
                telphone: '',
                smsCode: '',
                imgCode: '',
                channel: this.$route.query.channel
            },
            disable: false,
            returnUrl: this.$route.query.url,
            alias: this.$route.query.alias,
            from: this.$route.query.from
        }
    },
    mixins: [cmsBannerMixin],
    mounted() {
        this.getImgCode()
    },
    methods: {
        submit() {
            if (this.disable) {
                return
            }

            let loginAjax = smsLogin

            if (this.from === 'wechatAuth') {
                loginAjax = bindUser
            }

            if (this.check(this.form)) {
                this.disable = true
                this.form.openid = this.$route.query.openId
                this.form.username = this.form.telphone
                loginAjax(this.form).then((res) => {
                    if (res.success) {
                        let ticket = res.result ? res.result.ticket : ''
                        this.testCo = ticket
                        if (this.returnUrl) {
                            window.location.replace(this.returnUrl)
                        }
                    } else {
                        this.$_toast(res.resultDes || this.ERRORTXT)
                    }
                    this.disable = false
                })
            }
        },
        check(form) {
            if (!testTelphone(form.telphone)) {
                form.telphone ? this.$_toast('手机号格式输入不正确') : this.$_toast('请输入您的手机号码')
                return
            }
            if (!testVcode(form.smsCode)) {
                form.smsCode ? this.$_toast('短信验证码格式错误') : this.$_toast('请输入短信验证码')
                return
            }
            if (this.imgCodeVisible) {
                if (!testImgCode(form.imgCode)) {
                    form.imgCode ? this.$_toast('图形验证码错误') : this.$_toast('请输入图形验证码')
                    return
                }
            }
            return true
        },
        clearUsername() {
            this.form.telphone = ''
        },
        getCode(type) {
            if (type === 'send') {
                if (!testTelphone(this.form.telphone)) {
                    this.form.telphone ? this.$_toast('手机号输入不正确') : this.$_toast('请输入手机号')
                    return
                }
                if (this.imgCodeVisible && !testImgCode(this.form.imgCode)) {
                    if (this.form.imgCode === '') {
                        this.$_toast('请输入图形验证码')
                    } else {
                        this.$_toast('图形验证码输入不正确')
                    }
                    return
                }

                if (this.isTiming) {
                    return
                }

                sendCodeMsg({
                    smstype: this.smstype || 'normal',
                    telphone: this.form.telphone,
                    imgCode: this.form.imgCode
                }).then((res) => {
                    if (res.success) {
                        this.isTiming = true
                    } else {
                        if (!this.imgCodeVisible) {
                            this.imgCodeVisible = true
                        }
                        this.getImgCode()
                        this.$_toast(res.resultDes)
                    }
                })
            } else {
                this.isTiming = false
            }
        },
        getImgCode() {
            this.imgCodeSrc = urlHandler('/login/vcode?time=' + +new Date())
            this.form.imgCode = ''
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
$designWidth: 1080;
.page_smslogin {
    background-color: #fff;
    .mui-cell__hd {
        display: none;
    }
}
.mt0 {
    margin-top: 0;
}
.border10 {
    border-radius: px2rem(100);
}

.aui-protocol {
    padding: 0 px2rem(45);
    margin-left: px2rem(45);
}

.aui-protocol {
    font-size: px2rem(38);
    line-height: px2rem(140);
    padding-left: px2rem(60);
    background: url(../images/agree.png) no-repeat left center;
    background-size: px2rem(41);
    color: #222;
    a {
        color: #76d0ff;
    }
}

.line_under {
    position: relative;
    &:after {
        content: " ";
        position: absolute;
        left: 0.68267rem;
        bottom: 0;
        right: 0;
        height: 1px;
        background: #e4e4e4;
        -webkit-transform-origin: px2rem(30) 100%;
        transform-origin: px2rem(30) 100%;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
    }

}


</style>
