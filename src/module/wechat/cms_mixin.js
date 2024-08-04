import {
    renderData
} from 'src/api/login'

let cmsBannerMixin = {
    data() {
        return {
            bannerDefault: require('../images/login_banner.png'),
            cmsBanner: '',
            cmsAlias: this.$route.query.alias
        }
    },
    computed: {
        banner() {
            return this.cmsBanner || this.bannerDefault
        }
    },
    mounted() {
        if (this.cmsAlias) {
            this.getCmsData()
        }
    },
    methods: {
        getCmsData() {
            let params = {
                alias: this.cmsAlias,
                type: '/cms'
            }
            renderData(params).then((res) => {
                if (res.success) {
                    let blocks = res.result.blocks
                    for (let i = 0; i < blocks.length; i++) {
                        let _title = blocks[i].title
                        if (_title === 'loginBanner') {
                            this.cmsBanner = blocks[i].img
                        }
                    }
                }
            })
        }
    }
}
export { cmsBannerMixin }
