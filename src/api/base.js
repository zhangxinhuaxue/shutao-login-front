import Vue from 'vue'
import VueResource from 'vue-resource'
import textEnum from '@/libs/text.enum'
import qs from 'qs'
import { urlHandler, logServerOrigin } from '@/libs/domain'
import { accessLogUtil, pageLoadLog, apiAccessLog, accessLog } from '@/libs/accessLog'
import { getStorage } from '@/libs/utils'

Vue.use(VueResource)

let vm = new Vue()
let $loading

const reqLoadingLogical = () => {
    $loading = vm.$_loading()
    if (!$loading.isVisible) {
        $loading.show()
    }
}

const hideLoading = (extend) => {
    if (extend && extend.showLoading) {
        $loading.hide()
    }
}

/**
 * 格式化JSON
 */
Vue.http.options.emulateJSON = true

/**
 * 添加跨域允许cookie设置，默认情况下跨域请求不允许携带cookie
 * interceptors 拦截器
 */
Vue.http.interceptors.push(function(request, next) {
    if(!navigator.cookieEnabled){ 
        vm.$_toast('请取消浏览器无痕浏览模式，或取消cookie禁用')
        accessLog({type: 'api-logic', name: 'login-cookieNotEnabled', desc: 'cookie禁用', extendData: request.url})
        return Promise.reject()
    }
    request.credentials = true

    // 页面初始化加载逻辑处理
    pageLoadLog('+')

    // 接口headers添加唯一链路码
    let eventId = accessLogUtil.getEventId('api')
    // 暂时只在相对路径（同域下）接口添加X-TRACE-ID，否则存在跨域问题（后面和后端一起改掉）
    // if (/^\/\w+/.test(request.url) && request.url.indexOf('/access/log') < 0) {
    if (request.url.indexOf('/access/log') < 0) {
    // if (request.url.indexOf('/access/log') < 0) {
        request.headers.set('X-TRACE-ID', eventId)
    }
    // 统计接口响应时间
    let startTime = Date.now()

    next((response) => {
        // 页面初始化加载逻辑处理
        pageLoadLog('-')
        apiAccessLog(request, response, eventId, startTime)
        if (response.status === 0) {
            vm.$_toast('网络连接失败，请检查网络')
        }
        return response
    })
})

/**
 * 格式化返回
 */
export const formatRet = (data, url) => {
    // const requestUrl = url ? (url.indexOf('http') === 0 ? url : urlHandler(url)) : ''
    const result = data.ret || data
    // try {
    //     let msg = result.resultDes || ''
    //     if(msg === '系统繁忙，请稍后再试' && requestUrl) {
    //         const apiOwnerList = getStorage('apiOwnerList')
    //         let owner = '010'
    //         if (Array.isArray(apiOwnerList) && apiOwnerList.length > 0) {
    //             let ownerItem = apiOwnerList.find(e => e.interfaceName === requestUrl)
    //             if(ownerItem) {
    //                 owner = ownerItem.interfaceDutyCode || '012'
    //             } else {
    //                 owner = '011'
    //             }
    //         }
    //         msg = `系统繁忙，请稍后再试（${owner}）`
    //     }
    //     result.resultDes = msg
    // } catch (error) {
    //     console.log('数据解析异常:' + requestUrl)
    // }
    
    return result
}

// the promise way of get service data
export const _getPromise = (url, data, extend = {}) => {
    let condition = Object.assign(
        {
            showLoading: false, // 是否显示菊花转转
            isShowAllData: false // 是否显示完整data
        },
        extend
    )

    return new Promise((resolve, reject) => {
        if (condition.showLoading) {
            reqLoadingLogical()
        }
        Vue.http
            .get(urlHandler(url), {
                params: data
            })
            .then(
                (response) => {
                    if (condition.isShowAllData) {
                        resolve(response.data)
                    } else {
                        resolve(formatRet(response.data, url))
                    }
                    hideLoading(extend)
                },
                (response) => {
                    if (response.status !== 0) {
                        vm.$_toast(`系统繁忙，请稍后再试（${response.status}）`)
                    }
                    hideLoading(extend)
                }
            )
    })
}

// the promise way of post service data
export const _postPromise = (url, data, extend = {}) => {
    if (data && typeof data === 'object') {
        for (var key of Object.keys(data)) {
            data[key] = data[key] || typeof data[key] === 'number' ? data[key] : ''
        }
    }

    return new Promise((resolve, reject) => {
        let condition = Object.assign(
            {
                showLoading: false, // 是否显示菊花转转
                isShowAllData: false // 是否显示完整data
            },
            extend
        )
        if (condition.showLoading) {
            reqLoadingLogical()
        }
        Vue.http.post(urlHandler(url), data, {
            emulateJSON: extend.json ? false : true
        }).then(
            (response) => { 
                resolve(formatRet(response.data, url))
                hideLoading(extend)
            },
            (response) => {
                // 手动埋点接口不做错误处理
                if (url.indexOf('/access/log') >= 0 || url.indexOf('/mointoring/interfaceInfos') >= 0 || !navigator.cookieEnabled) {
                    return false
                }
                if (response.status !== 0) {
                    vm.$_toast(`系统繁忙，请稍后再试（${response.status}）`)
                }
                hideLoading(extend)
            }
        )
    })
}

// 新手动埋点支持app发送
export const accessLogRequest = (param, isNeedBack, showLoading) => {
    let url = logServerOrigin + '/access/log'
    // let url = '/access/log'
    if (navigator.sendBeacon && !isNeedBack) {
        const blob = new Blob([qs.stringify(param)], {
            type: 'application/x-www-form-urlencoded'
        })
        return navigator.sendBeacon(url, blob)
    } else {
        return _postPromise(url, param, { showLoading: showLoading })
    }
}
