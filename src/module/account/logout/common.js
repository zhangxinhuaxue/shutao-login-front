export default {
    data() {
    },
    methods: {
        goFace(url) {
            if (url) {
                window.location.href = decodeURIComponent(url)
            } else {
                this.$_toast('刷脸系统异常,请稍后再试')
            }
        }
    }
}
