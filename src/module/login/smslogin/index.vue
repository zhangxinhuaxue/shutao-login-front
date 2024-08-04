<template>
    <div class="page_login page_login__sms">
        <basic-page :titleInfo="titleInfo" :btn="btn" :warnInfo="warnInfo" @complete="goNext"></basic-page>
        <part-protocol :isBasicPro="true">
            <span v-if="isPureLogin" slot="right" @click="goResetPhone">
                手机号换了
            </span>
        </part-protocol>
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
import { sendCodeMsg } from 'src/api/login'
import { goReset } from '../common/commonfunc'
import { urlHandler } from 'src/libs/domain.js'
import { commonMixin } from 'src/module/common/common_mixin'
import { testImgCode } from 'src/libs/regs'
export default {
    name: 'loginSms',
    mixins: [commonMixin],
    data() {
        return {
            sourceType: this.$route.query.sourceType || 'smslogin',
            btn: {
                doNeed: true,
                txt: '下一步'
            },
            phoneNo: '',
            /* 图形验证码的 */
            imgCode: '',
            imgCodeSrc: '',
            dialogTitle: '请输入图形验证码'
        }
    },
    computed: {
        isPureLogin() {
            return this.sourceType !== 'wxBind' && this.sourceType !== 'qqBind'
        },
        titleInfo() {
            if (this.sourceType === 'wxBind' || this.sourceType === 'qqBind') {
                return {
                    doNeed: true,
                    main: '绑定手机号',
                    sub: '为了您的账户安全， 请先绑定手机号'
                }
            } else {
                return {
                    doNeed: true,
                    main: '请输入手机号',
                    sub: '请输入您的手机号，登录或注册您的账号'
                }
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        if (to.query && (to.query.sourceType === 'wxBind' || to.query.sourceType === 'qqBind')) {
            document.title = '绑定手机号'
        }
        next()
    },
    created() {},
    mounted() {
    },
    methods: {
        goNext(data) {
            // 已经检验过的数据，直接可用
            this.phoneNo = data
            this.sendSmsCode()
        },
        sendSmsCode() {
            sendCodeMsg({
                source: 'smslogin',
                smstype: 'reg',
                telphone: this.phoneNo,
                imgCode: this.imgCode
            }).then((res) => {
                if (res.success) {
                    this.$router.push({
                        name: 'smsCheck',
                        query: {
                            ...this.$route.query,
                            phoneNo: this.phoneNo,
                            sourceType: this.sourceType
                        }
                    })
                } else {
                    this.warn(res.resultDes || this.ERRORTXT)
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
        goResetPhone() {
            goReset()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
/* 图形验证码 */
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
