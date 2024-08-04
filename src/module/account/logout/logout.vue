<template>
    <div class="mui-page">
        <div class="mui-content">
            <div class="info">
                <p class="icon">
                    <img :src="imgSrc" alt="">
                </p>
                <p class="desc">账号注销，以下信息将会发生变化</p>
            </div>
            <m-cell-group>
                <m-cell title="身份、账号信息、会员权益将会被停用且无法恢复"></m-cell>
                <m-cell title="所有活动奖励以及优惠券信息将被取消"></m-cell>
                <m-cell>
                     <div slot="title" class="cell-info">
                        <p>订单将被清空</p>
                        <p class="tips">· 请确保所有订单已完成且无任何异议</p>
                        <p class="tips">· 账户删除后历史订单关闭可能产生的资金退款等将视作自动放弃</p>
                    </div>
                </m-cell>
            </m-cell-group>
            <m-button @click="logout">刷脸注销</m-button>
        </div>
    </div>
</template>
<script>
import {getaddr} from 'src/api/account_logout'
import commonMix from './common'
export default {
    name: 'accountLogout',
    data() {
        return {
            imgSrc: require('../img/warn.svg'),
            faceData: '',
            disalbed: false
        }
    },
    mixins: [commonMix],
    created() {},
    mounted() {},
    methods: {
        logout() {
            let backurl = `${window.location.origin}/views/account/logoutResult`
            if (this.disalbed) return false
            getaddr({
                vivoCallbackUrl: backurl
            }).then((res) => {
                if (res.success) {
                    this.goFace(res.result)
                } else {
                    if (res.code === '2001') {
                        this.$_toast({
                            txt: '用户未登录',
                            callback: function() {
                                window.JSBridge.callNative({
                                    module: 'user',
                                    method: 'login',
                                    params: {
                                        type: 0
                                    },
                                    callback: (ret) => {
                                        if (ret.data && ret.data.result == 'true') {
                                            window.location.reload()
                                        }
                                    }
                                })
                            }
                        })
                    } else if (res.code === '2002') {
                        this.$_toast('抱歉，您暂不符合注销条件')
                    } else if (res.code === '2003') {
                        this.$_toast('实名认证用户才可刷脸注销')
                    } else {
                        this.$_toast(res.resultDes)
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/module/style.scss';
.info{
    padding: px2rem(20) 0 px2rem(60);
    background-color: #fff;
    .icon{
        width: px2rem(140);
        height: px2rem(140);
        margin: 0 auto;
    }
    .desc{
        text-align: center;
        font-size: px2rem(36);
        height: px2rem(44);
        line-height: px2rem(44);
        color: #131314;
        margin-top: px2rem(20);
    }
}
.cell-info{
    p:nth-child(2){
        margin-top: px2rem(24);
    }
    .tips{
        font-size: px2rem(26);
        color: #717172;
        margin-top: px2rem(12);
        padding-left: px2rem(20);
        text-indent: px2rem(-20);
    }
}
.mui-page{
    .aui-cell-bd{
            font-size: px2rem(28);
            color: #131314;
        }

    .mui-btn_large{
            width: px2rem(622);
            line-height: px2rem(88);
            border-radius: px2rem(45);
            margin-top: px2rem(60);
        }
    
} 
</style>


