<template>
    <div class="page_login page_uc__sms">
        <basicPage :type="'identifyID'" :titleInfo="titleInfo" :warnInfo="warnInfo" :btn="btn" @complete="goNext">
            <template slot="content_input">
                <input-ui
                    :isImageCode="true"
                    type="text"
                    :requestPath="requestPath"
                    :updateImgCode="updateImgCode"
                    @inputComplete="setImgCode"
                    :placeholder="'请输入图形验证码'">
                </input-ui>
            </template>
        </basicPage>
        <!-- <partProtocol :isBasicPro="true"> </partProtocol> -->
        <div class="protocol">
            <label class="">
                <input class="checkbox__original" type="checkbox" v-model="checked" />
                <m-icon class="checkbox-icon" :type="iconClass"></m-icon>我已阅读并同意
            </label>
            <span @click.stop="goProtocal('userRegistration')">《用户注册协议》</span>，<span @click="goProtocal('SY_zjlys')">《招集令隐私权政策》</span>
        </div>
    </div>
</template>
<script>
import { validateIdentifyID } from 'src/api/ucenter'
import { imgCodeMixin } from 'src/module/common/common_mixin'
import { goProtocal } from 'src/libs/utils'

export default {
    name: 'loginSms',
    mixins: [imgCodeMixin],
    data() {
        return {
            titleInfo: {
                doNeed: true,
                main: '输入身份证号',
                sub: '请输入您需要修改的原手机号实名认证时绑定的身份证号'
            },
            // placeholderPhone: '请输入身份证号',
            btn: {
                doNeed: true,
                txt: '下一步'
            },
            checked: false
        }
    },
    computed: {
        iconClass() {
            return this.checked ? 'checkbox_checked' : 'checkbox_unchecked'
        }
    },
    created() {},
    mounted() {},
    methods: {
        goNext(data) {
            if (!this.checkImgCode()) {
                return
            }
            if (!this.checked) {
                this.warn('请先阅读并同意协议')
                return
            }
            validateIdentifyID({
                idCard: data,
                imgCode: this.imgCode
            }).then((res) => {
                if (res.success) {
                    let token = res.result ? res.result.token : ''
                    this.$router.push({
                        name: 'channels',
                        query: {
                            ...this.$route.query,
                            token
                        }
                    })
                } else {
                    this.warn(res.resultDes || this.ERRORTXT)
                }
            })
        },
        goPagePhoneNo() {
            this.$router.go(-1)
        },
        goProtocal(id) {
            goProtocal(id)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../style.scss';
.protocol {
    display: block;
    text-align: left;
    font-size: 12px;
    line-height: px2rem(80);
    padding: px2rem(24);
    color: #222;
    span {
        color: #007FFF;
    }
}
.checkbox {
    padding: px2rem(10) px2rem(32);
    font-size: px2rem(24);
    color: #999;
    background-color: #fff;
    position: absolute;
    bottom: px2rem(120);
    width: 100%;
    span {
        color: #007FFF;
    }
}

.checkbox-icon {
    color: #4286FF;
    font-size: px2rem(24);
    margin-right: px2rem(6);
}
body.aym {
    .checkbox-icon {
        color: #FFE550;
    }
}
.checkbox__original {
    display: none;
}
</style>
