import Vue from 'vue'
import App from './App.vue'
import 'src/libs/sentry'
import router from './router'
import 'src/libs/axdApp'
import { includeJs, includeCss, isAym, setStorage, getStorage } from 'src/libs/utils'
import { install as Global } from './global'
import { urlHandler } from 'src/libs/domain.js'
import { _postPromise } from './api/base'
import { monitorServer } from 'src/libs/domain'
Vue.use(Global)

try{
    // ios 低版本 返回出错 orign path 错位
    if(window.history && 'replaceState' in window.history){
        window.history.replaceState(null, '', location.href)
    }
}catch(e){}

if (isAym) {
    document.body.className += ' aym'
}
// 从APP返回H5的时候会调用此方法，定义一下防止报错，可在业务内部重新定义以覆盖
window.axdBackFunc = () => {}

// 加载反欺诈css文件
// let pathname = document.location.pathname
// if (
//     pathname.indexOf('/views/wechat') !== -1 ||
//     pathname.indexOf('/views/login') !== -1
// ) {
//     includeCss(urlHandler('/login/themes/view.css'))
// } else if (
//     pathname.indexOf('/views/userCenter') !== -1 ||
//     pathname.indexOf('/views/account') !== -1 ||
//     pathname.indexOf('/sockpuppet') !== -1
// ) {
//     includeCss(urlHandler('/uc/themes/view.css'))
// } else {
//     includeCss(urlHandler('/themes/view.css'))
// }
// 生产环境
// if (import.meta.env.PROD) {
//     // 引入邦盛的二代指纹
//     let today = new Date()
//     let ymd = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate()
//     includeJs('//acf.aiyoumi.com/public/downloads/frms-fingerprint.js?custID=default&serviceUrl=https://acf.aiyoumi.com/public/generate/jsonp&loadSource=script&type=1&ymd=' + ymd)
// }

new Vue({
    el: '#app',
    router,
    render: h => h(App),
    template: '<App/>'
})

// let apiOwnerList = getStorage('apiOwnerList')
// if (!Array.isArray(apiOwnerList) || apiOwnerList.length === 0) {
//     _postPromise( monitorServer + '/monitoring/mointoring/interfaceInfos', {
//         type: 'http'
//     }, { showLoading: false, json: true }).then((res) => {
//         if (res.success) {
//             setStorage('apiOwnerList', res.data, 360)
//         }
//     }).catch(() => {
//         setStorage('apiOwnerList', null)
//     })
// }
