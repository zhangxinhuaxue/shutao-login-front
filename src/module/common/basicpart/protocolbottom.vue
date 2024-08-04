<template>
    <p class="block_protocol">
        <span :class="['protocol_left', alignStyle]" v-if="isBasicPro">
            我已阅读并同意<a class="link"  @click="handleLink(urlProtocol)">《用户注册协议》</a>
        </span>
        <slot class="protocol_left" v-else name="left"></slot>
        <slot name="right"></slot>
    </p>
</template>
<script>
import { regProto } from 'src/libs/regs'
export default {
    name: 'partPro',
    props: {
        isBasicPro: {
            type: Boolean,
            default: false
        },
        alignCenter: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            urlProtocol: regProto
        }
    },
    computed: {
        alignStyle() {
            return this.alignCenter ? 'text_center' : ''
        }
    },
    created() {},
    mounted() {
    },
    methods: {
        handleLink(url) {
            this.log({ type: 'button-link', name: 'h5signin-button-agreement' })
            location.href = url
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
.block_protocol {
    display: flex;
    font-size: px2rem(24);
    color: $colorLink;
    line-height: px2rem(33);
    text-align: center;
    margin-top: px2rem(23);
    margin-bottom: px2rem(180);
    .protocol_left {
        color: #999999;
        flex: 1;
        text-align: left;
    }
    .text_center {
        text-align: center;
    }
    .link {
        color: $colorLink;
    }
    .txt_counter {
        color: #CCCCCC;
    }
}
</style>
