/**
 *  Created by wangwb on 2021/03/09
 *  前端监控埋点上报
 **/
import {  accessLogRequest } from '@/api/base'
import { uuid, dateFormat, getCookie, setCookie   } from './utils' 

// 刷新或打开标识
let isSPAFirst = true

// 埋点相关方法
const accessLogUtil = {
    beforeRoute() {
        if (isSPAFirst) {
            isSPAFirst = false
        } else {
            window.$pageLogData = {
                stack: {
                    pageStartTime: Date.now() // 设置路由进入下一页面前时间
                }
            }
        }
    },
    afterRoute(curRoute, prevRoute) {
        // 初始化页面埋点变量，并发出PV访问日志log请求
        this.initData(curRoute, prevRoute)
        // 进入页面后时间（beforeCreate前），与beforeEach时间之差即异步js加载时间
        Object.assign(window.$pageLogData.stack, {
            pageAfterTime: Date.now()
        })
        // 发起页面加载时间统计方法
        pageLoadLog()
    },
    // 埋点主要数据初始化
    initData(curRoute, prevRoute) {
        let origin = window.location.protocol + '//' + window.location.host
        let prevUrl = prevRoute ? origin + prevRoute.fullPath : document.referrer
        let curUrl = curRoute ? origin + curRoute.fullPath : window.location.href

        // 进入当前页面前router.beforeEach时设置的时间
        let pageStartTime = window.$pageLogData && window.$pageLogData.stack && window.$pageLogData.stack.pageStartTime
       
        // 兼容 performance
        if ('performance' in window === false) {
            window.performance = {
                timing: {}
            }
        }
        
        // 路由进入时构建页面级变量
        window.$pageLogData = {
            stack: {
                pageIsLoaded: false,
                /**
                 * 当前页面的起始时间获取（分两种情形）
                 * 单页初始化：取navigationStart时间，若不支持此方法，再取单页index.html加载时设置的htmlExecTime时间
                 * 路由跳转页：由于navigationStart、htmlExecTime两个时间只在初始化时使用，以后起始时间从beforeRouter设置的时间算起
                 */
                pageStartTime: pageStartTime || performance.timing.navigationStart || window.htmlExecTime || Date.now(),
                // pageAfterTime: '', // 在router.afterEach中设置
                apiInitCount: 0
            },
            pageId: this.getPageId(),
            pageCode: (curRoute && curRoute.meta.code) || '',
            pageName: (curRoute && curRoute.name) || '',
            // pageTitle: document.title,   // cms页面的title从后面接口中取，需在发送时实时获取
            eventOrder: 0,
            costTime: null,
            url: curUrl,
            referrerId: this.getReferrerId(prevUrl)
        }

        // PV/UV全量埋点
        const referrer = prevRoute && prevRoute.fullPath !== '/' ? origin + prevRoute.fullPath : document.referrer
        if (curRoute && curRoute.name === 'notfound') {
            accessLog({ type: 'page-404', name: 'page-404', desc: '页面404', referrer })
        } else {
            accessLog({ type: 'page-access', name: 'page-access', desc: '页面PV', referrer })
        }
    },
    guid(flag, type) {
        return `${flag}${type ? '-' + type : ''}-${uuid(24, 16)}`
    },
    getPageId() {
        return this.guid('P')
    },
    getEventId(type) {
        return this.guid('E', type)
    },
    // 存储跳转页面行为id
    setReferrerId(refId) {
        const domain = location.hostname
            .split('.')
            .slice(-2)
            .join('.')
        setCookie('refJson', JSON.stringify({ refId, refUrl: window.location.href }), 1, domain)
    },
    getReferrerId(prevUrl) {
        let refs = JSON.parse(decodeURIComponent(getCookie('refJson'))) || {}
        let refId = ''

        if (!refs.refId) {
            return refId
        }

        // 校验是否为前一个页面的refId
        refId = refs.refUrl === prevUrl || refs.refUrl === document.referrer ? refs.refId : refId

        // 获取之后清除
        this.setReferrerId('')
        return refId
    }
}

// 埋点日志上报
function accessLog({ type = '', name, desc, url, ...restArgs }, isNeedBack = false, showLoading = false) {
    // // 若是直接调用，先进行页面变量初始化
    // if (!(window.$pageLogData && window.$pageLogData.pageId)) {
    //     accessLogUtil.initData()
    // }

    // // 复制页面全局变量，删除临时变量
    // let pageLogData = JSON.parse(JSON.stringify(window.$pageLogData))
    // Reflect.deleteProperty(pageLogData, 'stack')

    // // 根据细分类型分离出主类型
    // let eventType = type.split('-')[0]

    // // 全字段参数，注释部分为后端获取，前端不主动上传
    // const params = Object.assign(pageLogData, {
    //     pageTitle: document.title,
    //     eventId: restArgs.eventId || accessLogUtil.getEventId(eventType), // 接口事件id在store/base.js中生成，再传过来
    //     eventTime: dateFormat(new Date()),
    //     eventOrder: ++window.$pageLogData.eventOrder,
    //     eventName: name || '',
    //     eventDesc: desc || '',
    //     eventType,
    //     monitorType: type || '',
    //     url: url || pageLogData.url,
    //     extendData: null,
    //     ...restArgs
    // })

    // params.extendData = (params.extendData && JSON.stringify(params.extendData)) || null

    // // 保存最后一次跳转事件id
    // if (type && type.indexOf('link') > -1) {
    //     accessLogUtil.setReferrerId(params.eventId)
    // }
    // params.dataOrigin = 'h5'

    // if (import.meta.env.PROD) {
    //     return accessLogRequest(params, isNeedBack, showLoading)
    // }
}

// 页面访问及加载时间逻辑
function pageLoadLog(op) {
    // 若是没有路由的活动页直接调用，先进行页面变量初始化
    // if (!(window.$pageLogData && window.$pageLogData.pageId)) {
    //     accessLogUtil.initData()
    // }

    // let pageLogData = window.$pageLogData
    // // 若页面未完成加载时判断
    // if (pageLogData && !pageLogData.stack.pageIsLoaded) {
    //     if (op === '+') {
    //         ++pageLogData.stack.apiInitCount
    //     } else if (op === '-') {
    //         --pageLogData.stack.apiInitCount
    //     }
    //     // 查看接口初始化完成情况
    //     if (pageLogData.stack.apiInitCount === 0) {
    //         // 通过设置延时值，实现接口嵌套调用时，检测的连续性
    //         setTimeout(() => {
    //             if (pageLogData.stack.apiInitCount === 0 && !pageLogData.stack.pageIsLoaded) {
    //                 pageLogData.stack.pageIsLoaded = true

    //                 const curTime = Date.now() - 50
    //                 const costTime = curTime - pageLogData.stack.pageStartTime

    //                 // 上报页面访问事件(当活动单页没有route时，无法在在router.afterEach中设置pageAfterTime时间)
    //                 const { pageStartTime, pageAfterTime = performance.timing.domContentLoadedEventEnd } = pageLogData.stack
    //                 accessLog({
    //                     type: 'page-load',
    //                     name: 'page-load',
    //                     costTime,
    //                     extendData: {
    //                         staticTime: pageAfterTime - pageStartTime,
    //                         apiTime: curTime - pageAfterTime,
    //                         pageStartTime,
    //                         pageAfterTime,
    //                         navigationStart: performance.timing.navigationStart ,
    //                         htmlExecTime: window.htmlExecTime,
    //                     }
    //                 })
    //             }
    //         }, 50)
    //     }
    // }
}

// 接口访问及数据处理
function apiAccessLog(request, response, eventId, startTime) {
    // 请求方式不同，参数获取方式差异
    // let reqParams = request.method.toUpperCase() === 'GET' ? JSON.stringify(request.params || {}) : request.body || ''
    // // 对埋点上报接口自身不再上报，否则当接口事件时会进入无限循环
    // if (reqParams.indexOf('eventType') >= 0 && reqParams.indexOf('monitorType') >= 0) {
    //     return
    // }

    // let costTime = Date.now() - startTime
    // let params = { type: '', name: 'api-access', url: '', request: reqParams, response: '', desc: '', costTime, eventId }

    // // 相对地址处理
    // params.url = (request.url.indexOf('http') === 0 ? '' : window.location.protocol + '//' + window.location.host) + request.url

    // let status = response.status
    // if (status === 200) {
    //     let res = response.body
    //     res = res.ret || res
    //     // 存在success字段且为false
    //     if ('success' in res && !res.success) {
    //         Object.assign(params, { type: 'api-false', response: res.resultDes || '', desc: '接口校验失败提示', extendData: res.code })
    //     } else {
    //         // 正常的请求，埋点不上报参数
    //         params.request = ''
    //         params.type = 'api-access'
    //     }
    // } else {
    //     Object.assign(params, { type: 'api-error', response: response.status, desc: '接口访问异常错误码' })
    // }
    // accessLog(params)
}

export { accessLogUtil, pageLoadLog, apiAccessLog, accessLog }
