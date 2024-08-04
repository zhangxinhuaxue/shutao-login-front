<template>
    <div class="api-login">
        正在授权登录中，请稍后
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
</template>

<script>
import { apiLogin } from 'src/api/login'
import { parseQuery } from 'src/libs/utils'
export default {
    created() {
        const query = parseQuery()
        apiLogin({
            token: query.token
        }).then(res => {
            if (res.success && res.result && res.result.url) {
                window.location.replace(res.result.url)
            } else {
                this.$_toast(res.resultDes || this.ERRORTXT)
                if (res.resultDes === 'token已失效') {
                    setTimeout(() => {
                        window.history.go(-1)
                    }, 600)
                }
            }
        })
    }
}
</script>

<style lang="scss" scoped>
    .api-login {
        font-size: 14px;
        padding: 40% 0 0;
        text-align: center;
    }
    .spinner {
        margin: 30px auto 0;
        width: 70px;
        text-align: center;
    }

    .spinner > div {
        width: 18px;
        height: 18px;
        background-color: var(--auiColorDisabled);

        border-radius: 100%;
        display: inline-block;
        animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    }

    .spinner .bounce1 {
        animation-delay: -0.48s;
    }

    .spinner .bounce2 {
        animation-delay: -0.24s;
    }

    @keyframes sk-bouncedelay {
        0%, 80%, 100% { 
            transform: scale(0);
        } 
        40% { 
            transform: scale(1.0);
        }
    }
</style>
