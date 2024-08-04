<template>
    <div class="page_login sockpuppet">
        <h1>修改手机号</h1>
        <p class="title_sub" :class="{'color_warn': warning}">{{subTitle}}</p>
        <div class="input_container">
            <label>原手机号：</label>
            <input
                v-model="oldPhone"
                class="input_uniform"
                placeholder="请输入原手机号"
                type="tel"
                maxLength="11"
            />
            <span class="icon_delete" v-if="oldPhone.length" @click="clearInput('oldPhone')"></span>
        </div>
        <div class="input_container">
            <label for="">新手机号：</label>
            <input
                v-model="newPhone"
                class="input_uniform"
                placeholder="请输入新手机号"
                type="tel"
                maxLength="11"
            />
            <span class="icon_delete" v-if="newPhone.length" @click="clearInput('newPhone')"></span>
        </div>
        <div class="input_container mb60">
            <label for="">验证码：</label>
            <input
                v-model="smsCode"
                class="input_uniform code-input"
                placeholder="请输入验证码"
                type="tel"
                maxLength="6"
            />
            <span class="get-code" :class="isCounting?'disabled':''" @click="sendSmsCodeFn">
                {{countDownTxt}}
            </span>
        </div>
        <m-button  @click="goNextSms" :disabled="loading">下一步</m-button>
    </div>
</template>
<script>
import { resetphoneSubmit, sendMsgCode } from 'src/api/sockpuppet'
import { testTelphone } from 'src/libs/regs'
export default {
    name: 'sockpuppet-resetphone',
    data() {
        return {
            oldPhone: '',
            newPhone: '',
            smsCode: '',
            warning: false,
            isCounting: false,
            loading: true,
            countDownTxt: '获取验证码',
            currentCount: 60,
            subTitle: '请输入原、新手机号，并发送验证码'
        }
    },
    computed: {},
    created() {},
    watch: {
        oldPhone(curVal, oldVal) {
            if (oldVal.length === 10 && curVal.length === 11) {
                if (!testTelphone(curVal)) {
                    this.warning = true
                    this.subTitle = '请输入有效的原手机号'
                }
            } else {
                this.warning = false
                this.subTitle = '请输入原、新手机号，并发送验证码'
            }
        },
        newPhone(curVal, oldVal) {
            if (oldVal.length === 10 && curVal.length === 11) {
                if (!testTelphone(curVal)) {
                    this.warning = true
                    this.subTitle = '请输入有效的新手机号'
                }
            } else {
                this.warning = false
                this.subTitle = '请输入原、新手机号，并发送验证码'
            }
        }
    },
    methods: {
        clearInput(input) {
            this[input] = ''
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
        sendSmsCodeFn() {
            if (!testTelphone(this.oldPhone)) {
                this.warning = true
                this.subTitle = '请输入有效的原手机号'
                return
            }
            if (!testTelphone(this.newPhone)) {
                this.warning = true
                this.subTitle = '请输入有效的新手机号'
                return
            }
            this.subTitle = ''
            sendMsgCode({
                oldPhone: this.oldPhone,
                newPhone: this.newPhone
            }).then((res) => {
                if (res.success) {
                    this.countDown()
                    this.warning = false
                    this.subTitle = '验证码已发送，请注意接收'
                    this.loading = false
                } else {
                    this.warning = true
                    this.subTitle = res.resultDes || '系统繁忙，请稍后再试'
                }
            })
        },
        goNextSms() {
            resetphoneSubmit({
                oldPhone: this.oldPhone,
                newPhone: this.newPhone,
                smsCode: this.smsCode,
                callBackUrl: encodeURIComponent(window.location.origin + '/sockpuppet/resetphone/confirm')
            }).then((res) => {
                if (res.success && res.result.faceUrl) {
                    this.$router.push('/sockpuppet/resetphone/verify?faceUrl=' + encodeURIComponent(res.result.faceUrl))
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
@import 'src/module/style.scss';
h1 {
    font-size: px2rem(48); 
    color:$colorTextMain;
}
.title_sub {
    font-size: $fontXSTitle;
    color:$colorTextMain;
    margin-top: px2rem(32);
    margin-bottom: px2rem(100);
}
.color_warn {
    color: $colorWarn;
}
.input_container {
    font-size: px2rem(32);
    white-space: nowrap;
    color: #666;
    display: flex;
    align-items: center;
    border-bottom: 0.5px solid #e4e4e4;
    padding: px2rem(28) 0;
    label {
        // flex-shrink: 0;
        width: px2rem(170);
        text-align: left;
    }
}
.input_uniform {
    display: inline-block;
    flex: 1;
    line-height: 1.5rem;
    font-size: $fontSTitle;
    border-style: none;
    &.code-input {
        flex: none;
        width: px2rem(260);
    }
}
.icon_delete {
    width: px2rem(36);
    height: px2rem(36);
    background: url('@/module/images/cloese@2x.png') 0 center no-repeat;
    background-size: cover;
}
.get-code {
    // width: px2rem(400);
    font-size: px2rem(30);
    color: #4286FF;
    flex: 1;
    text-align: right;
    padding-right: 5px;
    &.disabled{
        color: #ccc;
        pointer-events: none;
    }
}
</style>
