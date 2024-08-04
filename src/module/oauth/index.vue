<template>
    <div class="page">
        <div v-if="!errorMsg">
            <div class="logo line_under">
                <img style="width:3rem;height:3rem;" src="./images/logo.png" />
                <div style="padding:0 1.5rem;">
                    <img style="width:2rem;" src="./images/access.png" />
                </div>
                <img style="width:3rem;height:3rem;" :src="otherIcon" />
            </div>
            <div class="accept-info">
                <b>授权{{name}}获取以下信息为您服务</b>
                <div class="item-info">获取您的部分信息（手机号等）</div>
            </div>
            <m-button class="border10" @click="submit">确认授权</m-button>
            <div class="aui-protocol">
                确认授权即表示同意
                <a
                    href="//m.aiyoumi.com/h5/user/contract/viewPublicTemplate/CT190625722"
                >《个人信息授权书》</a>
            </div>
        </div>
        <div class="aui-page" v-if="errorMsg">
            <div
                class="aui-content"
                v-if="errorMsg != 'mustlogin'"
                style="text-align:center; line-height:2rem;"
            >{{errorMsg}}</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import '../style.scss';

.page {
    padding: px2rem(32);
    font-size: 0.65rem;
    color: #666;
}

.accept-info {
    padding: 1.6rem 0.6rem;

    b {
        line-height: 1.5;
        font-size: 0.8rem;
        font-weight: normal;
        color: #131314;
    }

    .item-info {
        line-height: 2;

        &:before {
            content: '';
            display: inline-block;
            width: 0.2rem;
            height: 0.2rem;
            background: #ffe352;
            border-radius: 50%;
            vertical-align: middle;
        }
    }
}

.border10 {
    width: px2rem(622);
    margin-top: px2rem(54);
    border-radius: px2rem(100);
}

.aui-protocol {
    padding: 0 px2rem(30);
    margin-left: px2rem(20);
}

.aui-protocol {
    font-size: 0.6rem;
    line-height: px2rem(100);
    a {
        color: #027aff;
    }
}

.line_under {
    position: relative;
    &:after {
        content: ' ';
        position: absolute;
        left: 0.68267rem;
        bottom: 0;
        right: 0.68267rem;
        height: 1px;
        background: #e4e4e4;
        -webkit-transform-origin: px2rem(30) 100%;
        transform-origin: px2rem(30) 100%;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
}

.logo {
    padding: 2.5rem 1.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
<script>
import 'src/libs/axdApp'
import { getPageInit, userConfirm } from 'src/api/oauth'
import { isapp, login } from 'src/libs/appServer'

export default {
    name: 'oauth',
    data() {
        return {
            name: '',
            oauthBaseId: '',
            otherIcon: null,
            errorMsg: ''
        }
    },
    mounted() {
        this.name = ''

        let { orderId } = this.$route.query

        getPageInit({ orderId }).then(data => {
            if (data.success) {
                let result = data.result

                if (result.autoDo) {
                    location.href = result.redirectUrl
                } else {
                    this.name = result.displayName
                    this.otherIcon = result.icon
                    this.oauthBaseId = result.oauthBaseId
                }
            } else {
                this.errorMsg = data.resultDes
            }
        })
    },
    methods: {
        login() {
            if (isapp()) {
                login()
            } else {
                this.$router.replace({
                    name: 'index',
                    query: { cbUrl: location.href }
                })
            }
        },
        submit() {
            let { oauthBaseId } = this
            userConfirm({ oauthBaseId }).then(data => {
                if (data.success) {
                    location.href = data.result.redirectUrl
                } else if (data.code === '-2019') {
                    this.login()
                } else {
                    this.errorMsg = data.resultDes
                }
            })
        }
    }
}
</script>