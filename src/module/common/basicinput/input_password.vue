<!--
    heioray 2018/04/08 统一样式输入框input 密码
    demo:
    <input-password class="mb60"
        @inputComplete="setData"
        :max="16"
        :placeholder="'请输入密码'">
    </input-password>
-->
<template>
    <p class="input_container" v-if="!pwdShow">
        <input
            v-model="inputVal"
            class="input_uniform"
            :placeholder="placeholder"
            type="password"
            :maxLength="max"
            :minLength="min">
        <span class="icon_eye__close" @click="triggerPwdShow"></span>
    </p>
    <p class="input_container" v-else>
        <input
            v-model="inputVal"
            class="input_uniform"
            :placeholder="placeholder"
            type="text"
            :maxLength="max"
            :minLength="min">
        <span class="icon_eye" @click="triggerPwdShow"></span>
    </p>
</template>
<script>
export default {
    name: 'inputUi',
    props: {
        placeholder: {
            type: String
        },
        max: {
            type: String,
            default: '16'
        },
        min: {
            type: String,
            default: '0'
        }
    },
    data() {
        return {
            inputVal: '',
            pwdShow: false
        }
    },
    watch: {
        inputVal(curVal) {
            this.$emit('inputComplete', curVal)
        }
    },
    methods: {
        triggerPwdShow() {
            this.pwdShow = !this.pwdShow
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
.input_container {
    display: flex;
    align-items: center;
    border-bottom: 0.5px solid #E4E4E4;
    padding: px2rem(28) 0;
}
.input_uniform {
    display: inline-block;
    width: 100%;
    line-height: 1.5rem;
    font-size: $fontSTitle;
    border-style: none;
    // flex-basis: px2rem(560);
}
.icon_eye {
    width: px2rem(40);
    height: px2rem(40);
    background: url('../../images/eye@2x.png') 0 center no-repeat;
    background-size: cover;
}
.icon_eye__close {
    width: px2rem(40);
    height: px2rem(40);
    background: url('../../images/hide@2x.png') 0 center no-repeat;
    background-size: cover;
}
</style>
