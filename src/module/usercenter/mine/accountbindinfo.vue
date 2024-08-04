<template>
    <m-page>
        <m-cell-group>
            <m-cell @click="goSet('phone')"
                value="修改手机号"
                is-link>
                <div slot="title">
                    <p class="phone_title">手机号</p>
                    <p class="phone_subtitle">{{ phoneNo | PhoneReplace}}</p>
                </div>
                <img slot="icon"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAArlBMVEXv7+//////zgD+zwX+0RX+0A3/8LD90BD90hv/+uHy6b39/f309PT//fHx8fH//O7//Ov/++jy6Lfz57L/65X4217//vT/8Kz/7qP/7Z//7Jr/65D/3U762Er/8bX/76j/6Yv521n52lX52U762Eb/0An///zz5q752lL//vj/++Xz5qv43GL80yXv7+rw7d3x6cX233r/20L92Dnw69L/9cn14Yr24Yb/42r/4WVPyZvFAAABIElEQVRYw+3Z6VLCMBSG4fRrC9iWAsoqgrhUcCmyuN7/jRmSjo4zTpPgYaKQ5wLe32fOx7w4SRmRNIk9FjNKPJeQ9nguJe3xnOM424rWGQC/kGWhUBUCIe88GvQWPtRqBsUZdCz1gznwfLNxy3WFOtfgmlyLGwIj/WANOPLKjYFrF/xjwcoOgiO7wTvSYGAh2LMebKmDVy5YHmwqgudGwaqd4MxusPHvg33gUj8Y7iBYd8FfB7uK4AC40A9mwGRjKLSlU2kg9N8Mg2pGQd8Ff9bZ3+CqV5HaAU3w67KbbBvEN+PP4DtNMFudSWsQBEs8uGCJHDpe9YMv0BA+MX1LHyrBlJmYLyLpuHBSmHL3XDRnjnNQUuIc+euefFwgnz8+AGzNJrfLKFb+AAAAAElFTkSuQmCC"
                alt=""
                style="width:40px;margin-right:13px;display:block">
            </m-cell>
            <m-cell v-if="!hideBinding && isSupportBinding" @click="goSet('weixin')"
                title="微信"
                :value="isWXBind ? '已绑定' : '点击绑定'"
                is-link>
                <img v-if="isWXBind"
                slot="icon"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAulBMVEXv7+8AugDs7+z+/v6z4rMIvAjp7unU6dQEuwQyxTIRvhH09PTx8fHE5sQoxCgkwyQOvQ7O6M685LyW3JZt0m1FykUgwSDh7OHf7N/Y6ti447if3Z+C14Jx1HFSzVJKy0o/yD83xzcbwRsXwBcUvxQMvQzu7+7J58nA5cCl36WG2IZ21XZq0mosxCyQ2pB71Xs7yDvj7eOo36ig3qCb3ZuL2YtZzlna69qr4Ktk0GRdz11Oy05Lykuv4a+z3SDfAAACe0lEQVRYw+2Z2ZaiMBBAK8oitAuKoDQiCrjvdo/T093z/7810UMAR5KA8DBnDvdFkodLkqpUcgTq9ZcmlETzpV6HOpQJ1r2U6sO6Zqk+rKuoqPifqb2OxoovIjHYfR0Eqaiu96miJOL4XCug+62gR8z9s0rZRem0X5/ynTVExXlikGvEYnLK6xshNsogn+8d8ZjkmnV3FuWJ0rkLsSKSx34e4RGFfP0EeEMEH4dXjl6QI9YrFKJKgJmQpn23Gkp24RSF7G7NC2kuASMgwkdW3wJFtHBTMklrC5gNIrhPpIw6WgpG3BwLy0MDEcSsgXYRj8B19vZKz1p7TLZN2/YgHzOWTjyQPTJcCCthMQQ+DYbvKMMVSx8HYY/3afO2oUr39ee3NLjcv1NzLKawQ/WNblO9oAcaG1bEx9Tx3RLbSy8/C7rwB239rqOwEYUZPfYWJb7d6zanR0yjG7+pE26xMkCTacIWSqGBK1lNiYabMEd5awCNXynC7+TqbiVpTaJhgeCHz+804Sklc/REQgXX8Lhxnd1H5Y5G9zG5cUh6ceGN666QPCJbVGNP+zvGc4BtXMcsuR8+dpZDfZbhoGn590IT9xmIhwF05ClK0sZdba6wDQxqAUrg4Z6AK9SAwM1GMdMIPbqOnEaNRJT5azjlVbH2W61rO+7OU/0VyXcWDnPGWDeHJAJX2GLNuG0THaHmF5lx2kFx4AhzX22lDtO3hdwIxa+M/OOBYJIjuqS78k6G59Bn6fMdABd+1YjxJCjAx/HRKEMhlpsp2eSa4Zj4Zw9FGfTO+loXunMAaa0iA0pl2FdPUC6yBRUVFf8EzZJ1pf91X/rHhdI/f/wBByYnZ7G/J1UAAAAASUVORK5CYII="
                alt=""
                style="width:40px;margin-right:13px;display:block">
                <img v-else
                slot="icon"
                src="data:image/png;base64,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"
                alt=""
                style="width:40px;margin-right:13px;display:block">
            </m-cell>
            <m-cell v-if="!hideBinding && isSupportBinding" @click="goSet('qq')"
                title="QQ"
                :value="isQQBind ? '已绑定' : '点击绑定'"
                is-link>
                <img v-if="isQQBind"
                slot="icon"
                src="data:image/png;base64,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"
                alt=""
                style="width:40px;margin-right:13px;display:block">
                <img v-else
                slot="icon"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAABBRJREFUeAHtnetu6jAMgENhF3Z5/8fcjwk2dj18lTyFrmGcxHY7ZksopczE/uw4TdZui8+9fHx8pKenp/T+/p44DikT6LouLZfLtF6vE8eLPbTPx8fHtOdY1opPvhFYLBbp/v4+dWRewPvG58cTMINdx7ANqSMAuy5qXh08tGDX1auHJgQCYGMeBMAA2EigUT0yMAA2EmhUjwwMgI0EGtUjAwNgI4FG9VWjvoo6Oxur1ap/sVXUbxPtzyEs2lkyvb29fb1UOlX6kkkBAuvq6ipdXFwkII4J5wEKYASYLy8vabfbzWIXaRKAQGFD8vLycozZ0XPAvL6+7sGznQTMKcUdIFl3e3vbZ1WL4wTh5uamz97NZtPyVU26rrMww/Du7q4ZXu4xw5+ATCVuACVjaLUFiGTjFOIGUGPYHgNEPQWkt7gAxDmZRS0dZGKyyPBjNrsAZNb0EGbompm9xTZzgDiEY17CdaWnmHvmnhHOWWgKMF9BeGaF52RiCtDTkTxATFhek4kpQI+ZNwcnx8BjxeMhpgC9nBgD5RU8M4DUP8/ZdwjRK3imAIdOeb73Cp4ZQK8iXgqKV/8BsBSBE88HwBNBlX7MDGCpw3M7bwbwr9z1agbQaxY8ltEelzJmAL03EcZAethgAtB7C2sMHud+NcCSU57nuRa0hqiegdQdr3XoKcH4dQCtDT4FWv4zBNNyQlPPwLkBBKblNr8qQOB5rUHzLPvp2HJjVxWgpaE/QTr2OUPYyjY1gGTenCaPIVCr0qIGkAjPcfgKSIJrYZ8qQDF2ji3wLIaxGsA5D18J6GwBcvFsMTzEca3WIsgqGWhhmBa0/HsIsvZFtQrAoVHcxzyH/cCxh8m1t7hUAA6N4t5lIE4tz8/P6fX19cCMYbAPPqx4owIwN4qbvjF6LPoV9jWpYMN2uz0IpnatVgEoRonBeM1zHVOKPF9Cy03oViVFBaAYm98tTxZaGX1KYPKhS2ApKxai8pgDtYaMy+se8BjOljshx4DwIE4u8jyJ9shQyUCMy+GJ4YCdIguxZ6wGl+wUe2taFYCljoFnNXRKfRJIzz5NAeIkUc/rUclxjfMEjFnXM+vNAQKGyUW79gyBS7Zb9zPs1wUgnVrXQ8B5ZXoOcfHw8GD6Z9vYAWEm9lgvk4WUDGbgsUktd1zrWOUypmQMj3dZbCGV+uOCnmCx+0wt9MhIsyGME57wcqiA9Hr40CwDiT51j3UyDslyL3c0P2b4DV98jp58h7zP9fJj9BFaj+yjLzOAOAHAcxezIXzu4MS/ACgkKtsAWAlO1AKgkKhsA2AlOFELgEKisg2AleBELQAKicp2f5EfDCvZ9Sukbvg73dov+4t6sOum+Fsr5wCbNXrPbr9mjX+H8R8RpeSRecDj+B+FlmI+1Hi8nAAAAABJRU5ErkJggg=="
                alt=""
                style="width:40px;margin-right:13px;display:block">
            </m-cell>
        </m-cell-group>
        <m-dialog ref="dialog_imgcode"
            :title="dialogTitle"
            :closeOnConfirm="false"
            @confirm="confirmDialog">
            <div class="img_container">
                <div class="size_special"><input class="imgcode-input" maxLength="4" v-model="imgCode" type="text" placeholder="请输入验证码"></div>
                <img :src="imgCodeSrc" alt="" @click="changeImgCode">
            </div>
        </m-dialog>
    </m-page>
</template>
<script>
import {
    getBindSettings,
    unBindThirdOpenid,
    getPhoneRegInfo,
    sendSmsCode
} from 'src/api/ucenter'
import { urlHandler } from 'src/libs/domain.js'
import { testImgCode } from 'src/libs/regs'
import { isZjl, newerVersionThan } from 'src/libs/utils'
export default {
    name: '',
    data() {
        return {
            sourceResetPhone: 'resetPhone',
            sourceResetPwd: 'resetPwd',
            phoneNo: '',
            isWXBind: false,
            isQQBind: false,
            qqKey: '', // this.$route.query.qk,
            wechatKey: '', // this.$route.query.wk,
            imgCode: '', // 图形验证码
            imgCodeSrc: '',
            dialogTitle: '请输入校验码',
            token: '',
            source: '',
            isSupportBinding: newerVersionThan('1.3.0'),
            hideBinding: isZjl && newerVersionThan('1.4.2')
        }
    },
    computed: {
        nextPathName() {
            if (this.source === this.sourceResetPhone) {
                return 'resetPhoneStep2'
            }
            return ''
        }
    },
    filters: {
        PhoneReplace(value) {
            if (value.length === 11) {
                return value.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            } else {
                return value
            }
        }
    },
    created() {
        getBindSettings({}).then((res) => {
            if (res.success) {
                let result = res.result || {}
                this.phoneNo = result.phoneNo || ''
                this.isWXBind = result.doBindWechat
                this.isQQBind = result.doBindQQ
                this.qqKey = result.qk || ''
                this.wechatKey = result.wk || ''
            } else {
                // 隐藏错误toast，用户可以正常再去做更换手机号等操作
                // this.$_toast(res.resultDes || this.ERRORTXT)
            }
        })
    },
    methods: {
        goSet(type) {
            if (type === 'phone') {
                this.resetPhoneComfirm()
            } else {
                if ((type === 'weixin' && !this.isWXBind) || (type === 'qq' && !this.isQQBind)) {
                    let nativeUrl = type === 'weixin' ? ('ac://login/wechat?appKey=' + this.wechatKey) : ('ac://login/qq?appKey=' + this.qqKey)
                    let me = this
                    window.JSBridge.callNative({
                        module: 'Tools', // 模块名
                        method: 'action', // 方法名
                        params: {
                            url: nativeUrl
                        },
                        callback: function(res) {
                            // 回调函数 成功就刷新页面， 失败就toast提示稍后再试
                            if (res.code == '0') {
                                window.location.reload()
                            } else {
                                // me.$_toast('绑定失败，请稍后再试')
                            }
                        }
                    })
                } else {
                    // 弹窗提示解绑
                    this.$createDialog({
                        type: 'confirm',
                        content: '是否解除' + (type === 'weixin' ? '微信' : 'QQ') + '绑定？',
                        confirmBtn: {
                            text: '解除绑定',
                            href: 'javascript:;'
                        },
                        onConfirm: () => {
                            unBindThirdOpenid({
                                unbindType: type
                            }).then((res) => {
                                if (res.success) {
                                    window.location.reload()
                                } else {
                                    this.$_toast(res.resultDes || this.ERRORTXT)
                                }
                            })
                        }
                    }).show()
                }
            }
        },
        resetPhoneComfirm() {
            this.$createDialog({
                type: 'confirm',
                content: '是否要修改手机号',
                confirmBtn: {
                    text: '修改手机号',
                    href: 'javascript:;'
                },
                onConfirm: () => {
                    this.resetPhone()
                }
            }).show()
        },
        resetPhone() {
            this.getReginfo().then((result) => {
                let token = result.token
                this.token = token
                if (result.hasInfo) {
                    this.$router.push({
                        name: 'channels',
                        query: {
                            ...this.$route.query,
                            phoneNo: this.phoneNo,
                            nfrom: 'app_h5',
                            token
                        }
                    })
                    return
                }
                this.source = this.sourceResetPhone
                this.showSmsCodeDialog()
            })
        },
        getReginfo() {
            return new Promise((resolve, reject) => {
                getPhoneRegInfo({
                    phoneNo: this.phoneNo
                }).then((res) => {
                    if (res.success) {
                        resolve(res.result)
                        return
                    }
                    if (res.code === '1004') {
                        this.$_toast('您输入的手机号不存在，请重新输入')
                    } else {
                        this.$_toast(res.resultDes || this.ERRORTXT)
                    }
                })
            })
        },
        showSmsCodeDialog() {
            this.changeImgCode()
            this.$refs.dialog_imgcode.show()
        },
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
                    this.$router.push({
                        name: this.nextPathName,
                        query: {
                            ...this.$route.query,
                            phoneNo: this.phoneNo,
                            nfrom: 'app_h5',
                            token: this.token,
                            cbUrl: window.location.href
                        }
                    })
                } else {
                    this.dialogTitle = res.resultDes || this.ERRORTXT
                    // this.$_toast(res.resultDes || this.ERRORTXT)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../style.scss';
.phone_title {
    font-size: px2rem(30);
    margin-bottom: px2rem(10);
    color: #222222;
}
.phone_subtitle {
    font-size: px2rem(26);
    color: #999;
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
