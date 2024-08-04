<!--
    heioray 2018/04/08 短信验证码输入组件 6位
    demo:
    <input-sms @complete="setData"></input-sms>
-->
<template>
    <div class="part_input">
        <input type="tel" class="input_hidden" ref="realInput" v-model.trim="smsCode">
        <ul class="input_fake" @click="focusOnInput">
            <li v-for="n in 6">
                {{smsCodeArr[n-1] | numFilter}}
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'sms_code',
    data() {
        return {
            smsCode: ''
        }
    },
    computed: {
        smsCodeArr() {
            return this.smsCode.split('')
        }
    },
    filters: {
        numFilter(val) {
            if (!val) {
                return ''
            } else {
                return val
            }
        }
    },
    watch: {
        smsCode(curVal) {
            if (curVal.length === 6) {
                this.$emit('complete', curVal)
            }
        }
    },
    created() {},
    mounted() {
        this.focusOnInput()
    },
    methods: {
        focusOnInput() {
            let inputObj = this.$refs.realInput
            inputObj.focus()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
.part_input {
    position: relative;
}

.input_hidden {
    position: absolute;
    left: 0;
    top: 0;
    height: 0;
    opacity: 0;
    text-indent: -999rem; // 隐藏input文字
    margin-left: -100%; // 隐藏input光标
    width: 200%; // 保留inputDOM在页面可视区域内
}

.input_fake {
    display: flex;
    justify-content: space-between;
    li {
        width: px2rem(70);
        height: px2rem(70);
        line-height: px2rem(70);
        border-bottom: 1px solid #E4E4E4;
        text-align: center;
    }
}

</style>
