<template>
    <m-page class="page_ucenter">
        <m-cell-group cell-type="form">
            <m-input title="持卡人"
                native-type="tel"
                placeholder="请输入姓名"
                v-model="form.name"
                :readonly="true">
            </m-input>
            <m-input title="银行卡号"
                placeholder="请输入卡号"
                v-model="form.bankCardNo"
                :maxlength="21">
                <img v-if="false"
                @click="awakeCamera"
                slot="ft"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAh1BMVEUAAABISEhISEhHR0dKSkpHR0dJSUlfX19HR0dKSkpVVVVHR0dHR0dHR0dHR0dISEhISEhQUFBHR0dHR0dHR0dJSUlJSUlHR0dISEhISEhISEhISEhKSkpRUVFHR0dISEhISEhISEhISEhHR0dISEhISEhHR0dISEhISEhISEhJSUlISEhHR0eqAHn4AAAALHRSTlMA3yClWoR7BfIaC8LTnZFtZBP36+JTOea0i3hfMw/auq5wzMmYgWlNQj0qpvY09DoAAAFUSURBVDjLzZPbcoIwFEWBFrkJiAKieK312vX/39c0QNEySZzpi+vJTZY7M8mJ9Xp4OQNclTxhiJ8pim0Y4iqLZ+Hjp2JY7V33riCH5d+CMVRi6Vg77YfbBy19cV/dkci1bE6HKB5Wd8Q/MQE/GUnCoVw2KzugbP57sYzEzb6AZaaGt6fld4UcnOJqlxThE3IQd+e4N8qr/iCpQr1880WM3KJObGDr6WRvA34tf4Yx4OrkFKarLixECDTyGI79NiIt1XIAhA8zG6nlK2zuTwZytXyG7Z2cga+WS7B7V0a1nAFZL6diI81pHODzN6xzSDXyuwjnLnzBbK277kikhbxkJ0IWa+QgF3FeuUk0BWLD1AXdU5dbmObZ27dDeriYh19Qpu5o4mie1ZD/yz6szfKpua4IFkY3GMOkmVp82wAwk69mxzNMi3a6NmY1WvUD5hjwrBfiG1P/U3EHZjLkAAAAAElFTkSuQmCC"
                alt=""
                style="width: 20px; margin-right: 5px; display: block;">
            </m-input>
            <m-input  title="预留手机"
                native-type="tel"
                placeholder="请输入银行预留手机号"
                v-model="form.phoneNo"
                :maxlength="11">
            </m-input>
            <m-input title="验证码"
                native-type="tel"
                v-model.trim="form.smsCode"
                placeholder="请输入验证码"
                input-type="vcode"
                :maxlength="6"
                :isTiming="isTiming"
                @getCode="getCode">
            </m-input>
        </m-cell-group>
        <m-button class="mt40" @click="goNext">完成</m-button>
    </m-page>
</template>
<script>
import {
    getUserInfo,
    sendBindCardSms,
    bindCardCheck
} from 'src/api/ucenter'
import {
    testTelphone,
    testBankCardNO,
    testVcode
} from 'src/libs/regs'

export default {
    name: '',
    data() {
        return {
            phoneNo: this.$route.query.phoneNo,
            form: {
                name: '',
                bankCardNo: '',
                phoneNo: '',
                smsCode: ''
            },
            isTiming: false,
            token: ''
        }
    },
    created() {
        this.initData()
        this.form.phoneNo = this.phoneNo
    },
    mounted() {

    },
    methods: {
        initData() {
            getUserInfo({
                phoneNo: this.phoneNo
            }).then((res) => {
                if (res.success) {
                    this.form.name = res.result
                } else {
                    this.$_toast(res.resultDes || this.ERRORTXT)
                }
            })
        },
        getCode(type) {
            if (type === 'send') {
                sendBindCardSms({
                    phoneNo: this.phoneNo,
                    telphone: this.form.phoneNo,
                    bankcardNo: this.form.bankCardNo,
                    source: this.$route.query.verifySource
                }).then((res) => {
                    if (res.success) {
                        this.isTiming = true
                        this.token = res.result
                    } else {
                        this.$_toast(res.resultDes || this.ERRORTXT)
                    }
                })
            } else {
                this.isTiming = false
            }
        },
        awakeCamera() {
            window.JSBridge.callNative({
                module: 'Tools', // 模块名
                method: 'bank', // 方法名
                params: {
                },
                callback: function(res) { // 回调函数 TODO 回调逻辑有待完善
                    if (res.data && !res.data.status) {
                        // 刷脸验证成功
                        let cbUrlVerify = this.$route.query.cbUrlVerify
                        if (cbUrlVerify) {
                            window.location.replace(cbUrlVerify)
                        }
                    } else {
                        this.$_toast(this.ERRORTXT)
                    }
                }
            })
        },
        goNext() {
            if (!this.dataCheck()) {
                return
            }

            let {
                name,
                bankCardNo,
                smsCode,
                imgCode
            } = this.form

            bindCardCheck({
                source: this.$route.query.verifySource,
                bankCardNo,
                phoneNo: this.phoneNo,
                verifyCode: smsCode,
                token: this.token,
                imgCode
            }).then((res) => {
                if (res.success) {
                    let verifySource = this.$route.query.verifySource
                    let tarName = verifySource === 'resetPwd' ? 'resetPwdStep3' : 'resetPhoneStep3'

                    // 身份验证后根据来源跳转到重置密码/手机号的第三步
                    this.$router.push({
                        name: tarName,
                        query: {
                            ...this.$route.query,
                            source: 'fromBank'
                        }
                    })
                } else {
                    this.$_toast(res.resultDes || this.ERRORTXT)
                }
            })
        },
        dataCheck() {
            let {
                name,
                bankCardNo,
                phoneNo,
                smsCode,
                imgCode
            } = this.form

            if (!name) {
                this.$_toast('用户名不可为空')
                return false
            }

            if (!testTelphone(phoneNo)) {
                phoneNo ? this.$_toast('请输入有效手机号') : this.$_toast('手机号不可为空')
                return false
            }

            if (!testBankCardNO(bankCardNo)) {
                bankCardNo ? this.$_toast('请输入有效银行卡号') : this.$_toast('银行卡号不可为空')
                return false
            }

            if (!testVcode(smsCode)) {
                smsCode ? this.$_toast('请输入有效短信验证码') : this.$_toast('短信验证码不可为空')
                return false
            }

            return true
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../style.scss';
.mt40 {
    margin-top: px2rem(40);
}
.page_ucenter ::v-deep .mui-cell__input_vcode{ 
    height: px2rem(128);
    padding-top:0;
    padding-bottom:0;
    .mui-vcode__btn{
        color: $colorLink;
        &:before{
            display:none;
        }
    }
}
</style>
