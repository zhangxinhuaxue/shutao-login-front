import basicPage from 'src/module/common/basicpage/index.vue'
import partProtocol from 'src/module/common/basicpart/protocolbottom.vue'
import inputUi from 'src/module/common/basicinput/input_ui.vue'
import {
    testImgCode
} from 'src/libs/regs'
let commonMixin = {
    data() {
        return {
            warnInfo: ''
        }
    },
    computed: {},
    components: {
        basicPage,
        partProtocol
    },
    mounted() {},
    methods: {
        warn(info) {
            this.warnInfo = ''
            setTimeout(() => {
                this.warnInfo = info
            }, 0)
            // this.$_toast(info)
        }
    }
}
let imgCodeMixin = {
    mixins: [commonMixin],
    data() {
        return {
            imgCode: '',
            updateImgCode: '0.55',
            requestPath: '/uc/vcode?time='
        }
    },
    components: {
        inputUi
    },
    methods: {
        setImgCode(val) {
            this.imgCode = val
        },
        checkImgCode() {
            if (!testImgCode(this.imgCode)) {
                this.imgCode ? this.warn('请输入4位有效图形验证码') : this.warn('图形验证码不可为空')
                return false
            }
            return true
        },
        updateImgCodeFun() {
            this.updateImgCode = (Math.random() * 100) + ''
        }
    }
}
export { commonMixin, imgCodeMixin }
