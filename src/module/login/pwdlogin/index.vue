<template>
    <div class="page_login page_login__pwd">
        <basic-page :type="'null'" :titleInfo="titleInfo" :btn="btnInfo" :warnInfo="warnInfo" @complete="goNext">
            <p slot="content_input">
                <input-ui
                    @inputComplete="setPhoneNo"
                    :placeholder="'请输入手机号'">
                </input-ui>
                <input-password
                    @inputComplete="setPassword"
                    :placeholder="'请输入密码'">
                </input-password>
                <input-ui
                    :isImageCode="true"
                    :type="'text'"
                    :updateImgCode="updateImgCodeStr"
                    @inputComplete="setImgCode"
                    :placeholder="'请输入图形验证码'">
                </input-ui>
            </p>
        </basic-page>
        <partProtocol :isBasicPro="true">
            <span slot="right"   @click="showMore">
                登录遇到问题
            </span>
        </partProtocol>
    </div>
</template>
<script>
import inputUi from 'src/module/common/basicinput/input_ui.vue'
import inputPassword from 'src/module/common/basicinput/input_password.vue'
import { commonMixin } from 'src/module/common/common_mixin'
import {
    testTelphone,
    testPwd,
    testImgCode
} from 'src/libs/regs'
import {
    getEncryptedPsw,
    isSecureUrl
} from 'src/libs/utils'
import {
    doLogin
} from 'src/api/login'
import {
    goReset,
    urlDebugHandler
} from '../common/commonfunc'
export default {
    name: 'loginPwd',
    mixins: [commonMixin],
    data() {
        return {
            titleInfo: {
                doNeed: true,
                main: '密码登录',
                sub: '请输入您的手机号和密码，登录您的账号'
            },
            btnInfo: {
                doNeed: true,
                txt: '登录'
            },
            phoneNo: '',
            passWord: '',
            imgCode: '',
            updateImgCodeStr: '0.55'
        }
    },
    computed: {
        doWarn() {
            return this.titleInfo.sub !== '请输入您的手机号和密码，登录您的账号'
        }
    },
    components: {
        inputUi,
        inputPassword
    },
    created() {},
    mounted() {},
    methods: {
        // set value
        setPhoneNo(data) {
            this.phoneNo = data
        },
        setPassword(data) {
            this.passWord = data
        },
        setImgCode(data) {
            this.imgCode = data
        },
        // 提交
        goNext() {
            if (!testTelphone(this.phoneNo)) {
                this.phoneNo ? this.warn('请输入有效手机号码') : this.warn('手机号码不可为空')
                return
            }
            if (!testPwd(this.passWord)) {
                this.passWord ? this.warn('请输入8-16位数字和字母组合') : this.warn('密码不可为空')
                return
            }
            if (!testImgCode(this.imgCode)) {
                this.imgCode ? this.warn('请输入4位有效图形验证码') : this.warn('图形验证码不可为空')
                return
            }
            // this.log('passwordlogin-button-login', '登录')
            this.log({ type: 'button-logic', name: 'passwordlogin-button-login' })

            // 密码加密
            let encryptedPwd = getEncryptedPsw(this.passWord)
            // console.log('encryptedPwd', encryptedPwd)

            doLogin({
                username: this.phoneNo,
                password: encryptedPwd,
                code: this.imgCode,
                channel: this.$route.query.channel,
                _spm_: this.$route.query._spm_
            }).then((res) => {
                if (res.success) {
                    let returnUrl = this.$route.query.cbUrl
                    if (returnUrl && isSecureUrl(returnUrl)) {
                        window.location.href = urlDebugHandler(returnUrl)
                    } else {
                        this.$router.go(-2)
                    }
                } else {
                    this.warn(res.resultDes || this.ERRORTXT)
                    this.updateImgCodeStr = (Math.random() * 100) + ''
                }
            })
        },
        // 登录遇到问题 展示更多
        showMore() {
            this.actionsheet = this.$createActionSheet({
                data: ['忘记密码', '手机号换了'],
                onSelect: (item, index) => {
                    // 跳转到重置密码/更换手机号
                    this.log({ type: 'button-link', name: 'passwordlogin-button-qanda' })
                    if (index) {
                        this.phoneNo ? goReset('phone', this.phoneNo, 'step2') : goReset()
                    } else {
                        this.phoneNo ? goReset('pwd', this.phoneNo, 'step2') : goReset('pwd')
                    }
                }
            })
            this.actionsheet.show()
        }
    }
}
</script>
<style lang="scss" scoped>
// @import 'src/module/style.scss';
</style>
