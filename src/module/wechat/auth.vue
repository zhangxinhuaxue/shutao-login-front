<!--
    heioray 2018/03/16 微信授权登录页面
-->
<template>
    <m-page class="page_auth" :loading="loadingShow">
    </m-page>
</template>
<script>
import {
    getAppId,
    getWeChatInfo
} from 'src/api/login'
import {
    isWeixin,
    setCookie,
    setCookieSeconds
} from 'src/libs/utils'
export default {
    name: 'wechatAuth',
    data() {
        return {
            loadingShow: true,
            cbUrl: this.$route.query.cbUrl,
            code: this.$route.query.code,
            alias: this.$route.query.alias,
            pause: this.$route.query.pause,
            channel: this.$route.query.channel,
            debug: this.$route.query.debug,
            appId: '',
            ticket: ''
        }
    },
    created() {},
    mounted() {
        if (this.code) {
            this.getToken()
        } else {
            this.init()
        }
    },
    methods: {
        init() {
            if (isWeixin()) {
                document.title = '微信授权'
                getAppId().then((res) => {
                    if (res.success) {
                        this.appId = res.result.appid
                        this.getWechatCode()
                    } else {
                        this.$_toast({
                            txt: res.resutDes || this.ERRORTXT,
                            callback: () => {
                                this.goBack()
                            }
                        })
                    }
                })
            } else {
                this.$router.replace({
                    name: 'bindinfo',
                    query: {
                        url: this.cbUrl,
                        openId: this.openId,
                        alias: this.alias,
                        channel: this.channel
                    }
                })
            }
        },
        getWechatCode() {
            let returnUrl = encodeURIComponent(location.href)
            let wechatUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + this.appId
            let otherParams = '&response_type=code&scope=snsapi_userinfo&state=1&connect_redirect=1#wechat_redirect'
            let fullUrl = wechatUrl + '&redirect_uri=' + returnUrl + otherParams
            // console.log(fullUrl)
            if (!this.debug) {
                window.location.replace(fullUrl)
            }
        },
        getToken() {
            getWeChatInfo({
                code: this.code
            }).then((res) => {
                if (res.success) {
                    this.ticket = res.result.ticket || res.result.token
                    this.openId = res.result.openid
                    if (!this.ticket && this.pause != '1') {
                        this.goBindInfo()
                    } else {
                        this.goBackUrl()
                    }
                } else {
                    this.$_toast(res.resutDes || this.ERRORTXT)
                }
            })
        },
        goBindInfo() {
            this.$router.replace({
                name: 'bindinfo',
                query: {
                    url: this.cbUrl,
                    openId: this.openId,
                    alias: this.alias,
                    from: 'wechatAuth'
                }
            })
        },
        goBackUrl() {
            window.location.replace(this.cbUrl)
        },
        goBack() {
            window.history.back()
        }
    }
}
</script>
