<template>
    <div class="pre-status">
        <m-dialog ref="authConfirm"
            type="confirm"
            confirmBtn="同意"
            cancelBtn="稍等再说"
            @cancel="goBack"
            @confirm="goAuth">
            <div>
                <p class="title">同意授权以下信息，为我提供服务</p>
                <p class="sub-title">手机号码：{{phone}}，用于快捷登录</p>
            </div>
        </m-dialog>
    </div>
</template>

<script>
import { getUserStatus } from '@/api/sockpuppet'
import { mjbLogin, isMjb } from '@/libs/utils'
export default {
    data() {
        return {
            phone: '',
            faceUrl: '',
            step: '1',
            backUrl: decodeURIComponent(this.$route.query.backUrl || 'https%3A%2F%2Fm.zhaojiling.com%2Fpages%2Frrh%2Findex')
        }
    },
    created() {
        getUserStatus({
            callBackUrl: encodeURIComponent(location.href)
        }).then(res => {
            if (res.success) {
                // 用户已绑定召集令直接跳转
                if (res.result.step === '1') {
                    this.goZjlPage()
                } else {
                    // 授权弹窗
                    this.phone = res.result.phone
                    this.$refs['authConfirm'].show()
                    this.step = res.result.step
                    this.faceUrl = res.result.faceUrl
                }
            } else {
                if (res.code === '-1999' && isMjb) {
                    this.$_toast(res.resultDes)
                    setTimeout(() => {
                        mjbLogin()
                    }, 1000)
                } else {
                    this.$_alert(res.resultDes).then(res => {
                        this.goBack()
                    })
                }
            }
        })
    },
    methods: {
        goBack() {
            if (isMjb) {
                axdApp.close()
            } else {
                window.history.go(-1)
            }
        },
        goAuth() {
            if (this.step === '2') {
                window.location.replace(this.faceUrl)
            } else if (this.step === '3') {
                getUserStatus({
                    callBackUrl: encodeURIComponent(location.href),
                    confirm: true
                }).then(res => {
                    if (res.success) {
                        this.goZjlPage()
                    } else {
                        this.$_alert(res.resultDes).then(res => {
                            this.goBack()
                        })
                    }
                })
            } else if (this.step === '4') {
                this.$refs['authConfirm'].hide()
                this.$_alert('该手机号在招集令已被授权').then(res => {
                    this.goBack()
                })
            } else {
                this.$refs['authConfirm'].hide()
                this.$_alert('授权失败，请联系客服').then(res => {
                    this.goBack()
                })
            }
        },
        goZjlPage() {
            window.location.replace(this.backUrl)
        }
    }
}
</script>

<style lang="scss" scoped>
 .pre-status ::v-deep .mui-dialog-panel {
    text-align: center;
    .mui-dialog__btn_primary {
        color: #4286FF;
    }
    .title {
        padding-bottom: 10px;
        font-size: 16px;
    }
    .sub-title {
        font-size: 13px;
        color: #666;
    }
    .mui-icon {
        width: 1.1em;
        height: 1.1em;
        padding: 1px;
    vertical-align: -0.14em;
    }
 }
</style>
