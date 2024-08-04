<!--
    heioray 2018/04/09 通用基础样式
    顶部一个主标题，一个副标题
    下侧一个输入框
    一个确认按钮
    demo:
    <basicPage :type="'null'" :titleInfo="titleInfo" :btn="btnInfo" @complete="goNext">
        <p slot="content_input">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde tempora vero, sapiente iure obcaecati ex adipisci quia nesciunt expedita ducimus aspernatur harum ipsam corrupti impedit ut, veniam, reiciendis eum. Mollitia.
        </p>
    </basicPage>
-->
<template>
    <div>
        <!-- title -->
        <title-top v-if="titleInfo.doNeed" :title="titleInfo.main" :subTitle="subTitle" :warning="doWarn"></title-top>
        <!-- input -->
        <input-sms v-if="type === 'smscode'"
            @complete="setData">
        </input-sms>
        <div class="mb60">
            <input-password v-if="type === 'password'"
                @inputComplete="setData"
                :max="'16'"
                :placeholder="'请输入密码'">
            </input-password>

            <input-ui v-if="type === 'phoneno'"
                @inputComplete="setData"
                :placeholder="placeholderPhone">
            </input-ui>

            <input-ui v-if="type === 'identifyID'"
                @inputComplete="setData"
                :max="'18'"
                :type="'text'"
                :placeholder="'请输入身份证号'">
            </input-ui>

            <slot name="content_input"></slot>
        </div>
        <!-- button -->
        <m-button v-if="btn.doNeed"   @click="returnData">{{btn.txt}}</m-button>
        <!-- other -->
        <slot name="other"></slot>
    </div>
</template>
<script>
import inputUi from '../basicinput/input_ui.vue'
import titleTop from '../basicpart/titletop.vue'
import inputPassword from '../basicinput/input_password.vue'
import inputSms from '../basicinput/smscode.vue'
import {
    testTelphone,
    testVcode,
    testPwd,
    testIdNum,
    testImgCode
} from 'src/libs/regs'
import {
    sendSmsCode
} from 'src/api/ucenter'
export default {
    name: 'basicPage',
    props: {
        titleInfo: {
            type: Object,
            default: () => {
                return {
                    doNeed: true,
                    main: '',
                    sub: ''
                }
            }
        },
        type: {
            type: String,
            default: 'phoneno'
        },
        btn: {
            type: Object,
            default: () => {
                return {
                    doNeed: true,
                    txt: '完成'
                }
            }
        },
        warnInfo: {
            type: String,
            default: ''
        },
        placeholderPhone: {
            type: String,
            default: '请输入手机号'
        }
    },
    data() {
        return {
            targetData: '',
            subTitle: this.warnInfo || this.titleInfo.sub,
            doWarn: false
        }
    },
    computed: {},
    components: {
        inputUi,
        inputSms,
        inputPassword,
        titleTop
    },
    watch: {
        warnInfo(curVal) {
            if (curVal) {
                this.doWarn = true
                this.subTitle = this.warnInfo
            }
        },
        targetData(curVal, oldVal) {
            if (this.doWarn && (curVal.length < oldVal.length)) {
                this.subTitle = this.titleInfo.sub
                this.doWarn = false
            }
        }
    },
    mounted() {},
    methods: {
        setData(data) {
            this.targetData = data
            if (!this.btn.doNeed) {
                this.returnData()
            }
        },
        returnData() {
            if (this.type === 'phoneno') {
                if (!testTelphone(this.targetData)) {
                    this.targetData ? this.warn('手机号格式错误') : this.warn('手机号不可为空')
                    return
                } else {
                    // this.log('h5signinno-button-next', '下一步')
                    this.log({ type: 'button-link', name: 'h5signinno-button-next' })
                }
            } else if (this.type === 'smscode') {
                if (!testVcode(this.targetData)) {
                    this.targetData ? this.warn('验证码格式错误') : this.warn('验证码不可为空')
                    return
                }
            } else if (this.type === 'password') {
                if (!testPwd(this.targetData)) {
                    this.targetData ? this.warn('请输入8-16位数字和字母组合') : this.warn('密码不可为空')
                    return
                }
            } else if (this.type === 'identifyID') {
                if (!testIdNum(this.targetData)) {
                    this.targetData ? this.warn('请输入18位有效身份证号') : this.warn('身份证号不可为空')
                    return
                }
            } else {
                this.$emit('complete', null)
                return
            }
            this.subTitle = this.titleInfo.sub
            this.doWarn = false
            // console.log('>>>输出信息：', this.targetData)
            this.$emit('complete', this.targetData)
        },
        warn(info) {
            this.subTitle = info
            this.doWarn = true
            // this.$_toast(info)
        }
    }
}
</script>
