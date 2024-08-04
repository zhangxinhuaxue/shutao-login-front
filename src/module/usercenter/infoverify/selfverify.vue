<template>
    <m-page class="page_ucenter">
        <h4 class="title">如何申请人工修改手机号码</h4>
        <section class="content">
            <p v-for="item in datalist">
                {{item}}
            </p>
        </section>
    </m-page>
</template>
<script>
import {
    renderDataForBlockType
} from 'src/api/login'
export default {
    name: '',
    data() {
        return {
            phoneNo: this.$route.query.phoneNo,
            datalist: ''
        }
    },
    created() {
        this.initData()
    },
    methods: {
        initData() {
            let params = {
                alias: 'h5login_config',
                blockType: 'extend',
                blockName: 'datalist',
                renderPlatform: 'h5',
                type: '/cms'
            }
            renderDataForBlockType(params).then((res) => {
                if (res.success) {
                    let resJson = JSON.parse(res.result.objList)
                    this.datalist = resJson
                } else {
                    this.$_toast({
                        txt: res.resultDes || this.ERRORTXT,
                        callback: () => {
                            window.history.go(-1)
                        }
                    })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../style.scss';
.title {
    padding: px2rem(28) px2rem(32) 0;
    font-size: px2rem(30);
    line-height: px2rem(24);
    color: #474747;
}
.content {
    padding: px2rem(28) px2rem(32) 0;
    font-size: px2rem(28);
    color: #666666;
}
</style>
