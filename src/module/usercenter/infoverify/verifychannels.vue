<template>
    <m-page>
        <p class="tip">为了您的账户安全，请选择一种方式进行身份验证</p>
        <m-cell-group>
            <m-cell v-if="showFaceVer" 
                    title="刷脸验证"
                    is-link
                    @click="goFaceVerify()">
            </m-cell>
            <!-- <m-cell v-if="showCardVer"
                    title="银行卡验证"
                    is-link
                    @click="goCardVerify()">
            </m-cell> -->
            <m-cell v-if="showSelfVer"
                    title="自助申诉"
                    is-link
                    @click="goSelfVerify()">
            </m-cell>
        </m-cell-group>
    </m-page>
</template>
<script>
import {
    getVerifyChannel
} from 'src/api/ucenter'
export default {
    name: '',
    data() {
        return {
            token: this.$route.query.token,
            channelList: [],
            // uid: '',
            faceUrl: ''
        }
    },
    computed: {
        showFaceVer() {
            return this.isApp && this.channelList.some((item) => {
                return item.indexOf('faceIdentify') !== -1
            })
            // return this.isApp && this.channelList.indexOf('faceIdentify') !== -1
        },
        showCardVer() {
            return this.channelList.indexOf('cardIdentify') !== -1
        },
        showSelfVer() {
            return this.channelList.indexOf('selfHelp') !== -1
        }
    },
    created() {
        this.initData()
        window.dl = 'record:' + new Date().getTime()
    },
    methods: {
        initData() {
            getVerifyChannel({
                token: this.token,
                vivoCallbackUrl: window.location.origin + '/views/userCenter/ucIDCardVerifyResult'
            }).then((res) => {
                if (res.success) {
                    this.channelList = res.result
                    // this.uid = res.result[0]
                    let [faceIdentifyContent] = res.result.filter(item => item.indexOf('faceIdentify') !== -1)
                    if (faceIdentifyContent && faceIdentifyContent.indexOf('@@@@@') !== -1) {
                        this.faceUrl = faceIdentifyContent.split('@@@@@')[1]
                    }
                } else {
                    this.$_toast(res.resultDes || this.ERRORTXT)
                }
            })
        },
        goFaceVerify() {
            if (this.faceUrl) {
                const url = decodeURIComponent(this.faceUrl)
                window.location.href = url + (url.indexOf('?') > 0 ? '&' : '?') + 'sceneId=1000001551&token=' + this.token
            } else {
                this.$_toast('刷脸系统异常，请尝试其它方式')
            }
        },
        goCardVerify() {
            window.location.href = '/views/userCenter/cardVerify' + window.location.search
            // this.$router.push({
            //     name: 'cardVerify',
            //     query: this.$route.query
            // })
        },
        goSelfVerify() {
            this.$router.push({
                name: 'selfVerify',
                query: this.$route.query
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../style.scss';
.tip {
    padding: px2rem(28) 0 0 px2rem(32);
    font-size: px2rem(24);
    line-height: px2rem(24);
    color: #999999;
}
</style>
