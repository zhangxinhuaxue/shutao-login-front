<template>
    <div class="page_login page_uc__sms">
        <basicPage :titleInfo="titleInfo" :warnInfo="warnInfo" :btn="btn" @complete="goNext">
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
        <!-- <partProtocol :isBasicPro="true"></partProtocol> -->
        <!-- <partProtocol :isBasicPro="true">
            <span slot="right"  @click="goPageID">
                输入身份证号
            </span>
        </partProtocol> -->
        <div class="text-right">
            <span @click="goPageID">
                输入身份证号
            </span>
        </div>
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
import { goProtocal } from 'src/libs/utils'
import {
    sendSmsCode,
    getPhoneRegInfo
} from 'src/api/ucenter'
import { imgCodeMixin } from 'src/module/common/common_mixin'
export default {
    name: 'loginSms',
    mixins: [imgCodeMixin],
    data() {
        return {
            titleInfo: {
                doNeed: true,
                main: '更换手机号',
                sub: '请输入您的老手机号'
            },
            btn: {
                doNeed: true,
                txt: '下一步'
            },
            phoneNo: '',
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
        goNext(phoneNo) {
            if (!this.checkImgCode()) {
                return
            }
            if (!this.checked) {
                this.warn('请先阅读并同意协议')
                return
            }
            getPhoneRegInfo({
                phoneNo,
                imgCode: this.imgCode
            }).then((res) => {
                if (res.success) {
                    let result = res.result
                    let token = result ? result.token : ''
                    if (result && result.hasInfo) {
                        this.$router.push({
                            path: '/views/userCenter/channels',
                            query: {
                                ...this.$route.query,
                                token
                            }
                        })
                    } else {
                        sendSmsCode({
                            source: 'resetPhone',
                            phoneNo,
                            imgCode: this.imgCode
                        }).then((res) => {
                            if (res.success) {
                                this.$router.push({
                                    name: 'resetPhoneStep2',
                                    query: {
                                        ...this.$route.query,
                                        phoneNo,
                                        token
                                    }
                                })
                            } else {
                                this.warn(res.resultDes || this.ERRORTXT)
                                this.updateImgCodeFun()
                            }
                        })
                    }
                } else {
                    this.updateImgCodeFun()
                    if (res.code === '1004') {
                        this.warn('您输入的手机号不存在，请重新输入')
                    } else {
                        this.warn(res.resultDes || this.ERRORTXT)
                    }
                }
            })
        },
        goPageID() {
            this.log({ type: 'button-link', name: 'h5signin-button-idCard' })

            this.$router.push({
                name: 'resetPhoneStepUserID',
                query: {
                    ...this.$route.query
                }
            })
        },
        goProtocal(id) {
            goProtocal(id)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../style.scss';
.text-right {
    text-align: right;
    font-size: 13px;
     color: #007FFF;
     padding-top: 10px;
}
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
