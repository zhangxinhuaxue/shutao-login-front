<!--
    heioray 2018/04/08 头部title内容
    demo:
    <part-title :title="'请输入手机号'" :subTitle="'这里是副标题'" :warning="doWarn">
    </part-title>
    doWarn 布尔值 是否显示红色警告字体
-->
<template>
    <div>
        <h1>{{title}}</h1>
        <p class="title_sub" :class="{'color_warn': warning}">{{subTitle}}</p>
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: 'title_top',
    props: {
        title: {
            type: String
        },
        subTitle: {
            type: String
        },
        warning: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
h1 {
    font-size: px2rem(48); 
    color:$colorTextMain;
}
.title_sub {
    font-size: $fontXSTitle;
    color:$colorTextMain;
    margin-top: px2rem(30);
    margin-bottom: px2rem(100);
}
.color_warn {
    color: $colorWarn;
}
</style>
