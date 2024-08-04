<template>
    <div class="page_login page_sms__common">
        <!-- 主体 -->
        <basicPage :type="type" :titleInfo="titleInfo" :btn="btnInfo" :warnInfo="warnInfo" @complete="goNext"></basicPage>
        <partProtocol :isBasicPro="false">
            <span class="protocol_left" slot="left">
                <!-- 没收到短信？您可<a class="link" href="javascript:;">语音获取</a> -->
            </span>
            <span slot="right" @click="resendSmsCode">
                {{countDownTxt}}
            </span>
        </partProtocol>
        <!-- other -->
        <slot name="other"></slot>
        <m-dialog ref="dialog_imgcode"
            :title="dialogTitle"
            :closeOnConfirm="false"
            @confirm="confirmDialog">
            <div class="img_container">
                <span class="size_special"><input class="imgcode-input" maxLength="4" v-model="imgCode" type="text" placeholder="请输入验证码"></span>
                <img :src="imgCodeSrc" alt="" @click="changeImgCode">
            </div>
        </m-dialog>
    </div>
</template>
<script>
import basicPage from 'src/module/common/basicpage/index.vue'
import partProtocol from 'src/module/common/basicpart/protocolbottom.vue'
import {
    testTelphone,
    testImgCode
} from 'src/libs/regs'
import {
    sendSmsCode,
    checkSmsCode
} from 'src/api/ucenter'
import {
    urlHandler
} from 'src/libs/domain.js'
export default {
    name: 'loginSmsCheck',
    props: {
        source: {
            type: String,
            default: 'resetPhone'
        },
        warnInfo: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            titleInfo: {
                doNeed: true,
                main: '输入验证码',
                sub: '已发送验证码至' + this.$route.query.phoneNo
            },
            type: 'smscode',
            btnInfo: {
                doNeed: false
            },
            phoneNo: this.$route.query.phoneNo,
            smsCode: '',
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
    components: {
        basicPage,
        partProtocol
    },
    created() {},
    mounted() {
        this.countDown()
    },
    methods: {
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
                this.changeImgCode()
                this.$refs.dialog_imgcode.show()
            }
        },
        // resendSmsCode() {
        //     if (!this.isCounting) {
        //         sendSmsCode({
        //             source: this.source,
        //             phoneNo: this.phoneNo
        //         }).then((res) => {
        //             if (res.success) {
        //                 this.countDown()
        //             } else {
        //                 this.$_toast(res.resultDes || this.ERRORTXT)
        //             }
        //         })
        //     }
        // },
        changeImgCode() {
            this.imgCodeSrc = urlHandler('/uc/vcode?time=' + +new Date())
            this.imgCode = ''
        },
        confirmDialog() {
            if (!testImgCode(this.imgCode)) {
                this.imgCode ? (this.dialogTitle = '请输入4位有效验证码') : (this.dialogTitle = '验证码不可为空')
                return
            }
            sendSmsCode({
                source: this.source,
                phoneNo: this.phoneNo,
                imgCode: this.imgCode
            }).then((res) => {
                if (res.success) {
                    this.$refs.dialog_imgcode.hide()
                    this.countDown()
                } else {
                    this.dialogTitle = res.resultDes || this.ERRORTXT
                    this.changeImgCode()
                }
            })
        },
        goNext(data) {
            // console.log('>>>返回的验证码是：', data)
            this.$emit('complete', data)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/module/style.scss';
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
