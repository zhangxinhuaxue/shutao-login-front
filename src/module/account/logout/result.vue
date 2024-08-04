<template>
    <div class="mui-page">
        <div class="mui-content">
            <template v-if="isComplete">
                <div class="success" v-if="isSuccess">
                    <p class="icon">
                        <img :src="successImgUrl" alt="">
                    </p>
                    <p>注销成功</p>
                    <p v-if="isLogoutSuppor">期待与您再次相遇！如需再次使用，请重新注册!</p>
                    <p v-else>若APP处于登录状态，退出登录即可完成注销</p>
                    <m-button @click="back">完成</m-button>
                </div>
                <div class="fail" v-else>
                    <p class="icon">
                        <img :src="failImgUrl" alt="">
                    </p>
                    <p>注销失败</p>
                    <p>{{error}}</p>
                    <m-button v-if="isAgain" @click="again">再刷一次</m-button>
                    <m-button @click="back" v-else>确定</m-button>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
import {logoutResult} from 'src/api/account_logout'
import commonMix from './common'
export default {
    name: 'accountLogout',
    data() {
        return {
            isComplete: false,
            isSuccess: false,
            successImgUrl: require('../img/success.svg'),
            failImgUrl: require('../img/fail.svg'),
            error: '',
            isAgain: false,
            againUrl: ''
        }
    },
    computed: {
        isLogoutSuppor() {
            return this.appVersion >= 441
        }
    },
    mixins: [commonMix],
    created() {
        this.setHeader()
        this.getResult()
    },
    mounted() {},
    methods: {
        setHeader() {
            window.JSBridge.callNative({
                module: 'webview',
                method: 'configNavigationBar',
                params: {
                    visible: true,
                    leftbuttonVisible: false,
                    rightbuttonVisible: false
                }
            })
        },
        getResult() {
            let orderId = this.$route.query.orderId || ''
            let vivoCallbackUrl = `${window.location.origin}/views/account/logoutResult`
            logoutResult({orderId, vivoCallbackUrl}).then((res) => {
                this.isComplete = true
                if (res.success) {
                    this.isSuccess = true
                    if (this.isLogoutSuppor) {
                        this.logout()
                    }
                } else {
                    this.isSuccess = false
                    if (res.code === '3001') {
                        this.isAgain = true
                        this.error = '人脸比对失败，无法注销'
                        this.resetHeader()
                        this.goFace(res.result)
                    } else {
                        this.isAgain = false
                        this.error = res.resultDes
                    }
                }
            })
        },
        logout() {
            window.JSBridge.callNative({
                module: 'user',
                method: 'logout'
            })
        },
        back() {
            if (!this.isSuccess) {
                this.close()
            } else {
                window.JSBridge.callNative({
                    module: 'navigation',
                    method: 'goPage',
                    params: {
                        page: 'root',
                        loginFirst: false,
                        closeToRoot: true,
                        rootPage: 4
                    }
                })
            }
        },
        again() {
            if (this.againUrl) {
                this.resetHeader()
                window.location.replace(this.againUrl)
            }
        },
        close() {
            window.JSBridge.callNative({
                module: 'webview', // 模块名
                method: 'close'
            })
        },
        resetHeader() {
            window.JSBridge.callNative({
                module: 'webview',
                method: 'configNavigationBar',
                params: {
                    visible: true,
                    leftbuttonVisible: true,
                    rightbuttonVisible: false
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/module/style.scss';
.mui-page{
    .mui-btn_large{
            width: px2rem(622);
            line-height: px2rem(88);
            border-radius: px2rem(45);
            margin-top: px2rem(60);
        }
} 
.success, .fail{
    padding: px2rem(40) 0;
    background-color: #fff;
    p{
        text-align: center;
        margin-top: px2rem(20);
    }
    p:nth-child(2){
        line-height: px2rem(44);
        color: #131314;
        font-size: px2rem(36);
    }
    p:nth-child(3){
        line-height: px2rem(36);
        color:#717172;
        font-size: px2rem(28);
    }
}
.icon{
    width: px2rem(140);
    height: px2rem(140);
    margin: 0 auto;

}
</style>


