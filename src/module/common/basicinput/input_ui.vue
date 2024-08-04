<!--
    heioray 2018/04/08 统一样式输入框input
    demo:
    <input-ui class="mb60"
        @inputComplete="setData"
        :placeholder="'请输入手机号'">
    </input-ui>
-->
<template>
    <p class="input_container" v-if="isImageCode">
        <input
            v-model="inputVal"
            class="input_uniform"
            :placeholder="placeholder"
            :type="type"
            :maxLength="'4'"
        />
        <span class="img_code" @click="getImgCode">
            <img :src="imgSrc" alt />
        </span>
    </p>
    <p class="input_container" v-else>
        <input
            v-model="inputVal"
            class="input_uniform"
            :placeholder="placeholder"
            :type="type"
            :maxLength="max"
            :minLength="min"
        />
        <span class="icon_delete" v-if="inputVal.length" @click="clearInput"></span>
    </p>
</template>
<script>
import { urlHandler } from 'src/libs/domain.js'
export default {
    name: 'inputUi',
    props: {
        isImageCode: {
            type: Boolean,
            default: false
        },
        requestPath: {
            type: String,
            default: '/login/vcode?time='
        },
        placeholder: {
            type: String
        },
        type: {
            type: String,
            default: 'tel'
        },
        max: {
            type: String,
            default: '11'
        },
        min: {
            type: String,
            default: '0'
        },
        updateImgCode: {
            type: String
        }
    },
    data() {
        return {
            inputVal: '',
            imgSrc: ''
        }
    },
    watch: {
        inputVal(curVal) {
            this.$emit('inputComplete', curVal)
        },
        updateImgCode(curVal, oldVal) {
            this.getImgCode()
        }
    },
    mounted() {
        this.getImgCode()
    },
    methods: {
        clearInput() {
            this.inputVal = ''
        },
        getImgCode() {
            this.imgSrc = urlHandler(this.requestPath + new Date())
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
.input_container {
    display: flex;
    align-items: center;
    border-bottom: 0.5px solid #e4e4e4;
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
.icon_delete {
    width: px2rem(40);
    height: px2rem(40);
    background: url('../../images/cloese@2x.png') 0 center no-repeat;
    background-size: cover;
}
.img_code {
    display: inline-block;
    width: px2rem(190);
    height: px2rem(70);
    img {
        width: 100%;
    }
}
</style>
