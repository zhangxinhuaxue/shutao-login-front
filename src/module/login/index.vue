<template>
    <div class="page_login">
        <!-- 微信、QQ登录 -->
        <div class="part_wqlogin" v-if="currentWay === 'wechat' || currentWay === 'qq'">
            <h1>登录</h1>
            <p v-if="isWX" class="btn_login btn_login__wx" @click="goLoginWX">
                <span class="icon icon_wx"></span>
                <span>微信安全登录</span>
            </p>
            <p v-else class="btn_login btn_login__qq" @click="goLoginQQ">
                <span class="icon icon_qq"></span>
                <span>QQ安全登录</span>
            </p>
            <part-protocol :alignCenter="true" :isBasicPro="true"></part-protocol>
        </div>
        <!-- 短信登录 -->
        <div class="part_smslogin" v-else>
            <part-title :title="'请输入手机号'" :subTitle="h5SubTitle" :warning="doWarn"></part-title>
            <input-ui class="mb60"
                @inputComplete="setPhoneNo"
                :placeholder="'请输入手机号'">
            </input-ui>
            <m-button  @click="goNextSms" :disabled="loading">下一步</m-button>
            <part-protocol :isBasicPro="true">
                <span slot="right" @click="goResetPhone" >
                    手机号换了
                </span>
            </part-protocol>
        </div>
        <!-- 其他登录方式 -->
        <!-- <div class="part_split">
            <p class="part_split__btn">其他登录方式</p>
        </div>
        <div class="part_otherway">
            <p class="btn_other" @click="goPage('smsLogin')" v-if="currentWay !== 'sms'">
                <span class="icon_other icon_sms"></span>
                <span class="btn_text">短信登录</span>
            </p>
            <p class="btn_other" @click="goPage('pwdLogin')">
                <span class="icon_other icon_pwd"></span>
                <span class="btn_text">密码登录</span>
            </p>
        </div> -->
        <!-- 短信验证码弹窗 -->
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
import {
    isWeixin,
    isQQ,
    parseQuery,
    isSecureUrl
} from 'src/libs/utils'
import {
    getAppId,
    getWeChatInfo,
    getQQParam,
    getQQInfo,
    sendCodeMsg
} from 'src/api/login'
import {
    testTelphone,
    testImgCode
} from 'src/libs/regs'
import inputUi from 'src/module/common/basicinput/input_ui.vue'
import partProtocol from 'src/module/common/basicpart/protocolbottom.vue'
import partTitle from 'src/module/common/basicpart/titletop.vue'
import { goReset, urlDebugHandler } from './common/commonfunc'
import { urlHandler } from 'src/libs/domain.js'
export default {
    name: 'loginIndex',
    data() {
        return {
            appId: '',
            code: this.$route.query.code,
            cbUrl: this.$route.query.cbUrl,
            currentWay: '', // wechat qq sms pwd
            phoneNo: '',
            h5SubTitle: '请输入您的手机号，登录或注册您的账号',
            h5NextDisabled: true,
            /* 图形验证码的 */
            imgCode: '',
            imgCodeSrc: '',
            loading: false,
            dialogTitle: '请输入图形验证码'
        }
    },
    computed: {
        isWX() {
            return isWeixin()
        },
        isQQ() {
            // return isQQ()
            return false // 暂时关闭QQ登录入口
        },
        doWarn() {
            return this.h5SubTitle !== '请输入您的手机号，登录或注册您的账号'
        }
    },
    components: {
        inputUi,
        partProtocol,
        partTitle
    },
    watch: {
        phoneNo(curVal, oldVal) {
            if (oldVal.length === 10 && curVal.length === 11) {
                if (!testTelphone(curVal)) {
                    this.h5SubTitle = '请输入有效手机号码'
                }
            } else {
                this.h5SubTitle = '请输入您的手机号，登录或注册您的账号'
            }
        }
    },
    created() {
        this.resetURL()
    },
    mounted() {
        this.initLoginChannel()
        if (this.isWX && this.code) {
            this.getTicket()
        } else if (this.isQQ && this.code) {
            this.getQQTicket()
        }
    },
    methods: {
        // 这里是一个hack处理，由于一开始没有规范好大家使用时的参数传递，这里暴力处理一下，如果传过来的几个参数被包含在了cburl里面就在解析一下
        // 这样做不好，后面或者后面的人注意
        resetURL() {
            let {
                cbUrl = '',
                channel = '',
                _spm_ = ''
            } = this.$route.query

            cbUrl = decodeURIComponent(cbUrl)

            if (channel && _spm_) {
                return
            }

            if (cbUrl.indexOf('?') == -1) {
                return
            }

            if (cbUrl.indexOf('channel') == -1 && cbUrl.indexOf('_spm_') == -1) {
                return
            }

            let search = cbUrl.split('?')[1]
            let queryObj = parseQuery(search)

            channel = channel || queryObj.channel
            _spm_ = _spm_ || queryObj._spm_

            // 要是页面刷新很慢就换成pushState
            this.$router.replace({
                name: 'index',
                query: {
                    ...this.$route.query,
                    channel: channel,
                    _spm_: _spm_
                }
            })
        },
        initLoginChannel() {
            if (isWeixin()) {
                this.currentWay = 'sms' // wechat（暂时去掉微信登录）
            } else if (isQQ()) {
                this.currentWay = 'sms' // 'qq'
            } else {
                this.currentWay = 'sms'
            }
        },
        /**/
        /* -----------微信登录相关------------ */
        goLoginWX() {
            getAppId().then((res) => {
                if (res.success) {
                    this.appId = res.result.appid
                    this.getWechatCode()
                } else {
                    this.$_toast({
                        txt: res.resutDes || this.ERRORTXT,
                        callback: () => {
                            this.goBack()
                        }
                    })
                }
            })
        },
        getWechatCode() {
            // let returnUrl = encodeURIComponent(location.href)
            // 清除老的code，state，避免过期参数影响
            let returnUrl = encodeURIComponent(location.href.replace(/(?![?&])(code)=\w+\&state=1/gi, ''))
            let wechatUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appId
            let otherParams = '&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect'
            let fullUrl = wechatUrl + '&redirect_uri=' + returnUrl + otherParams
            // console.log(fullUrl)
            if (!this.debug) {
                window.location.href = fullUrl
            }
        },
        getTicket() {
            getWeChatInfo({
                code: this.code
            }).then((res) => {
                if (res.success) {
                    let {
                        ticket,
                        openid
                    } = res.result

                    if (!ticket) {
                        this.goPage('smsLogin', {
                            sourceType: 'wxBind',
                            openId: openid
                        })
                    } else {
                        this.goBackUrl()
                    }
                } else {
                    this.$_toast(res.resutDes || this.ERRORTXT)
                }
            })
        },
        /* -----------微信登录相关 END------------ */
        /* -----------QQ登录相关------------ */
        goLoginQQ() {
            getQQParam().then((res) => {
                if (res.success) {
                    this.appId = res.result.appid
                    this.getQQCode()
                } else {
                    this.$_toast({
                        txt: res.resutDes || this.ERRORTXT,
                        callback: () => {
                            this.goBack()
                        }
                    })
                }
            })
        },
        getQQCode() {
            let returnUrl = encodeURIComponent(location.href)
            let QQUrl = 'https://graph.qq.com/oauth2.0/authorize?client_id=' + this.appId
            let otherParams = 'scope=get_user_info&response_type=code&redirect_uri='
            let fullUrl = QQUrl + '&redirect_uri=' + returnUrl + otherParams
            // console.log(fullUrl)
            if (!this.debug) {
                window.location.href = fullUrl
            }
        },
        getQQTicket() {
            getQQInfo({
                code: this.code
            }).then((res) => {
                if (res.success) {
                    let {
                        ticket,
                        openid
                    } = res.result
                    if (!ticket) {
                        this.goPage('smsLogin', {
                            sourceType: 'qqBind',
                            openId: openid
                        })
                    } else {
                        this.goBackUrl()
                    }
                } else {
                    this.$_toast({
                        txt: res.resutDes || this.ERRORTXT
                    })
                }
            })
        },
        /* -----------QQ登录相关 END------------ */
        /* -----------短信登录相关------------ */
        setPhoneNo(data) {
            this.phoneNo = data
        },
        goResetPhone() {
            this.log({ type: 'button-link', name: 'h5signin-button-replace' })
            goReset()
        },
        closeDialog() {
            if (!testImgCode(this.imgCode)) {
                this.imgCode ? (this.dialogTitle = '请输入4位有效验证码') : (this.dialogTitle = '验证码不可为空')
                return
            }

            this.$refs.dialog_imgcode.hide()
            this.sendSmsCode()
        },
        setImgCode() {
            this.imgCodeSrc = urlHandler('/login/vcode?time=' + +new Date())
            this.imgCode = ''
        },
        goNextSms() {
            if (!testTelphone(this.phoneNo)) {
                this.phoneNo ? (this.h5SubTitle = '请输入有效手机号码') : (this.h5SubTitle = '手机号码不可为空')
                return
            }
            // this.log('h5signin-button-next', '下一步')
            this.log({ type: 'button-logic', name: 'h5signin-button-next' })

            this.sendSmsCode()
        },
        sendSmsCode() {
            this.loading = true
            sendCodeMsg({
                source: 'reg',
                smstype: 'reg',
                telphone: this.phoneNo,
                imgCode: this.imgCode
            }).then((res) => {
                this.loading = false
                if (res.success) {
                    this.$router.push({
                        name: 'smsCheck',
                        query: {
                            ...this.$route.query,
                            phoneNo: this.phoneNo
                        }
                    })
                } else {
                    this.h5SubTitle = res.resultDes || '系统异常请稍后再试'
                    if (res.code === '1003' || res.resultDes === '请输入图形验证码') {
                        this.setImgCode()
                        this.$refs.dialog_imgcode.show()
                    } else if (res.code === '1005' || res.resultDes === '图形验证码错误') {
                        this.dialogTitle = '请输入正确的图形验证码'
                        this.$refs.dialog_imgcode.show()
                    }
                }
            })
        },
        /* -----------短信登录相关 END----------- */
        /* -----------通用函数------------ */
        goPage(page, query = {}) {
            this.$router.push({
                name: page,
                query: {
                    ...this.$route.query,
                    ...query
                }
            })
        },
        goBackUrl() {
            if (this.cbUrl && isSecureUrl(this.cbUrl)) {
                window.location.href = urlDebugHandler(this.cbUrl)
            } else {
                this.$_toast('登陆成功，请退出后刷新再试')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
.page_login {
    h1 {
        font-size: px2rem(48);
        color: #222222;
    }
    .title_sub {
        font-size: px2rem(30);
        color: #474747;
        letter-spacing: 0;
    }
}
/* 顶部 */
.btn_login {
    width: px2rem(620);
    height: px2rem(88);
    line-height: px2rem(88);
    font-size: px2rem(36);
    color: #fff;
    display: flex;
    align-items: center;
    border-radius: px2rem(4);
    margin-top: px2rem(100);
    .icon {
        display: inline-block;
        width: px2rem(50);
        height: px2rem(50);
        margin-right: px2rem(10);

    }
}
.btn_login__wx {
    background: #00BA00;
    padding-left: px2rem(174);
    .icon_wx {
        background: url('../images/weixinanniu@2x.png') 0 center no-repeat;
        background-size: cover;

    }
}
.btn_login__qq {
    background: #13B7F5;
    padding-left: px2rem(177);
    .icon_qq {
        background: url('../images/qqanniu@2x.png') 0 center no-repeat;
        background-size: cover;
    }
}
.btn_login__h5 {
    background: #FFE352;
    text-align: center;
}

/* 分隔部分 */
.part_split {
    position: relative;
    width: px2rem(256);
    height: px2rem(34);
    margin: 0 auto px2rem(110);
    text-align: center;
    font-size: px2rem(24);
    color: #000000;
    line-height: px2rem(33);
    &:after {
        content: ' ';
        position: absolute;
        left: 0;
        top: 40%;
        width: 100%;
        height: 1px;
        background: #ccc;
        // z-index: 99;
    }
    .part_split__btn {
        position: absolute;
        left: 50%;
        top: 0;
        z-index: 1;
        transform: translate(-50%, 0);
        width: px2rem(152);
        background: #fff;
    }
}

/* 其他登录方式 */
.part_otherway {
    display: flex;
    justify-content: space-around; // space-evenly;
    align-items: center;
    .btn_other {
        width: px2rem(100);
        height: px2rem(150);
    }
    .icon_other {
        display: block;
        width: px2rem(84);
        height: px2rem(84);
        margin: 0 auto px2rem(25);
    }
    .icon_wechat {
        background: url('../images/duanxin@2x.png') 0 center no-repeat;
        background-size: cover;
    }
    .icon_qq {
        background: url('../images/qq@2x.png') 0 center no-repeat;
        background-size: cover;
    }
    .icon_sms {
        background: url('../images/duanxin@2x.png') 0 center no-repeat;
        background-size: cover;
    }
    .icon_pwd {
        background: url('../images/mima@2x.png') 0 center no-repeat;
        background-size: cover;
    }
    .btn_text {
        display: block;
        font-size: px2rem(24);
        color: #666666;
    }
}

/* 图形验证码 */
.img_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .size_special {
        display: inline-block;
        width: px2rem(280);
        height: px2rem(70);
        background: #F7F7F7;
        text-indent: px2rem(10);
        padding-top: px2rem(18);
        .imgcode-input {
            border: 0;
            font-size: px2rem(28);
            background: transparent;
            color: $colorTextMain;
        }
    }
    img {
        display: inline-block;
        width: px2rem(190);
        height: px2rem(70);
    }
}
</style>
