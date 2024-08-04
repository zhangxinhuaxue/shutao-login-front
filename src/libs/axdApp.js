/**
 * e.g.：
    axdApp.send({
        module: 'device',
        method: 'getInfo',
        params: {},
        callback: function(data) {
            alert(JSON.stringify(data))
        }
    })
 */ 
import './jsbridge'
import {  isZjl, isMjb } from './utils'

(function () {
    var core = {
        isNewApi: isZjl || isMjb,
        checkCount: 1,
        nativeApp: null,
        checkNative: function (args) {
            // 获取native字段
            if (window.appJS || window.webkit) {
                this.nativeApp = window.appJS ? window.appJS : window.webkit.messageHandlers.appJS
            }

            // ios7下第一次无法拿到native的字段，需要延时判断
            if (!this.nativeApp) {
                setTimeout(function () {
                    if (!core.nativeApp && core.checkCount < 3) {
                        core.checkNative(args)
                    }

                    // 延迟后如果有原生对象，则发送当前请求
                    if (core.nativeApp && args) {
                        core.bridge(args)
                    }
                    core.checkCount++
                }, 100)
            }
        },
        init: function () {
            this.checkNative()

            // 手机类型
            this.isAndroid = /android/gi.test(navigator.userAgent)

            // 当前请求队列
            this.reqStack = {}
        },
        /*
         * 新老接口桥接中转
         */
        bridge: function (args) {
            if (this.isNewApi) {
                this.newApi(args)
            } else {
                this.oldApi(args)
            }
        },
        /*
         * 老接口，后面稳定后可移掉
         */
        oldApi: function (args) {
            if (typeof args !== 'object' || !args.module || !args.method) {
                console.log('参数格式有误！')
                return
            }

            // 创建当前请求的全局唯一标识
            var self = this
            var onlyIdx = +new Date() + (Math.floor(Math.random() * 900) + 100)
            /*
             * 是否重复请求
             * @仅当两次参数完全一致时认作一次重复请求
             * @回调完成后会将reqStack中相应值清除
             */
            var isRepeatReq = function (args, onlyIdx) {
                var reqName = args.module + args.method
                var reqValue = JSON.stringify(args) + (args.callback ? args.callback.toString() : '')
                var flag = false

                var reqs = self.reqStack[reqName] = self.reqStack[reqName] || {}

                // 查询队列健值是否相同
                for (var i in reqs) {
                    if (reqs[i] === reqValue) {
                        flag = true
                        break
                    }
                }

                if (!flag) {
                    reqs[onlyIdx] = reqValue
                }

                return flag
            }

            // 防重复请求
            if (!args.repeat && isRepeatReq(args, onlyIdx)) {
                return
            }

            // 删除防重复参数（只在前端做校验）
            typeof args.repeat !== 'undefined' && delete args.repeat

            // 是否有自定义回调
            var hasCallback = !!args.callback

            // 4位参数默认按顺序补全，不然安卓下可能报参数错误
            args = Object.assign({
                module: '',
                method: '',
                params: {},
                callback: function () { }
            }, args)

            // 对android/ios参数分别解析
            var postData
            var arg

            if (this.isAndroid) {
                postData = []
                for (var i in args) {
                    if (typeof args[i] === 'object') {
                        // 对象转json字符串
                        arg = JSON.stringify(args[i])
                        if (arg.match(/^{}$/)) {
                            arg = ''
                        }
                    } else if (typeof args[i] === 'function') {
                        // 创建全局回调函数，并获取回调名
                        arg = createCallback(i, args[i])
                    } else {
                        arg = args[i]
                    }

                    postData.push(arg)
                }
            } else {
                postData = Object.assign({}, args)
                for (var j in args) {
                    if (typeof args[j] === 'function') {
                        // 后端只需要函数名，非函数实体
                        delete postData[j]
                        postData.callback = createCallback(j, args[j])
                    }
                }
            }

            // 对于用户未定义回调，尝试从全局查找回调
            if (!hasCallback) {
                // 老的全局回调列表
                var globalCallbackName = {
                    login: 'onAxdLogin',
                    setPayPassword: 'onAxdPayPasswordSet',
                    resetPayPassword: 'onAxdPayPasswordReset',
                    pay: 'onPayReturn',
                    share: 'onShareReturn'
                }[args.method]

                if (typeof window[globalCallbackName] === 'function') {
                    var callbackName = createCallback(globalCallbackName, window[globalCallbackName])
                    if (this.isAndroid) {
                        postData[3] = callbackName
                    } else {
                        postData.callback = callbackName
                    }
                }
            }

            /*
             * 创建随机回调函数，挂载在全局对象下
             * 返回原生需要的回调名
             */
            function createCallback(name, fn) {
                // 回调挂在接口对象(axdApp)下callbacks里
                window.axdApp.callbacks = window.axdApp.callbacks || {}

                // 生成唯一回调名（默认'callback' + 唯一随机数）
                name = name + onlyIdx

                // 定义随机回调
                window.axdApp.callbacks[name] = function () {
                    // 清除当前请求在队列中标识
                    var curRequest = self.reqStack[args.module + args.method]
                    if (curRequest) {
                        delete curRequest[onlyIdx]
                    }

                    // 执行用户回调
                    fn.apply(fn, arguments)
                }

                return 'window.axdApp.callbacks.' + name
            }

            // 返回子函数
            function send() {
                if (self.isAndroid) {
                    self.nativeApp && self.nativeApp.postMessage.apply(self.nativeApp, postData)
                } else {
                    self.nativeApp && self.nativeApp.postMessage(postData)
                }
            }

            return send()
        },
        /*
         * 主桥接逻辑已由原生开发人员维护（顶部的那一段js），这里只负责一些基本的判断和兼容
         */
        newApi: function (args) {
            if (typeof args !== 'object' || !args.module || !args.method) {
                console.log('参数格式有误！')
                return
            }

            // 对于用户未定义回调，尝试从全局查找回调
            if (!args.callback) {
                // 老的全局回调列表
                var globalCallbackName = {
                    login: 'onAxdLogin',
                    setPayPassword: 'onAxdPayPasswordSet',
                    resetPayPassword: 'onAxdPayPasswordReset',
                    pay: 'onPayReturn',
                    share: 'onShareReturn'
                }[args.method]

                if (typeof window[globalCallbackName] === 'function') {
                    args.callback = window[globalCallbackName]
                }
            }

            // 最后要提交的参数
            var postData = Object.assign({
                module: '',
                method: '',
                params: {},
                callback: function () { }
            }, args)

            window.JSBridge && window.JSBridge.callNative(postData)
        }
    }

    core.init()

    var axdApp = {
        send: function () {
            if (!core.nativeApp && core.checkCount <= 3) {
                core.checkNative.apply(core, arguments)
            } else {
                core.bridge.apply(core, arguments)
            }
        },
        login: function () {
            core.bridge({
                module: 'user',
                method: 'login',
                repeat: true,
                params: {
                    type: 0
                }
            })
        },
        refresh: function () {
            core.bridge({
                module: 'webview',
                method: 'refresh',
                params: {
                    joinLoginInfo: true
                }
            })
        },
        back: function () {
            core.bridge({
                module: 'webview',
                method: 'goBack'
            })
        },
        close: function () {
            core.bridge({
                module: 'webview',
                method: 'close'
            })
        },
        callPhone: function (arg) {
            core.bridge({
                module: 'tools',
                method: 'callPhone',
                params: {
                    phone: arg
                }
            })
        },
        setPayPassword: function () {
            core.bridge({
                module: 'security',
                method: 'setPayPassword'
            })
        },
        resetPayPassword: function () {
            core.bridge({
                module: 'security',
                method: 'resetPayPassword'
            })
        },
        testLog: function (logMsg) {
            core.bridge({
                module: 'tools',
                method: 'log',
                params: {
                    phone: logMsg
                }
            })
        }
    }

    window.axdApp = window.axdApp || axdApp
})()
