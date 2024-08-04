<template>
    <div class="page_login page_uc__sms">
        <basicPage :titleInfo="titleInfo" :btn="btn" :updateImgCode="updateImgCode" @complete="goNext" :warnInfo="warnInfo">
            <p slot="content_input">
                <input-ui ref="imgCode"
                    :requestPath="requestPath"
                    :isImageCode="true"
                    :type="'text'"
                    @inputComplete="setImgCode"
                    :placeholder="'请输入图形验证码'">
                </input-ui>
            </p>
        </basicPage>
    </div>
</template>
<script>
import { sendSmsCode } from 'src/api/ucenter'
import { imgCodeMixin } from 'src/module/common/common_mixin'
export default {
    name: 'loginSms',
    mixins: [imgCodeMixin],
    data() {
        return {
            titleInfo: {
                doNeed: true,
                main: '设置新手机号',
                sub: '请输入你要更换的新手机号'
            },
            btn: {
                doNeed: true,
                txt: '下一步'
            },
            phoneNoNew: '',
            phoneNo: this.$route.query.phoneNo,
            source: this.$route.query.source || 'resetPhone'
            // updateImgCode: '0.55',
            // imgCode: ''
        }
    },
    computed: {},
    created() {},
    mounted() {},
    methods: {
        // setImgCode(val) {
        //     this.imgCode = val
        // },
        goNext(val) {
            this.phoneNoNew = val

            sendSmsCode({
                source: this.source,
                phoneNo: this.phoneNoNew,
                imgCode: this.imgCode
            }).then((res) => {
                if (res.success) {
                    this.$router.push({
                        name: 'resetPhoneStep4',
                        query: {
                            ...this.$route.query,
                            phoneNo: this.phoneNoNew,
                            phoneNoOld: this.phoneNo
                        }
                    })
                } else {
                    this.updateImgCodeFun()
                    this.warn(res.resultDes || this.ERRORTXT)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
