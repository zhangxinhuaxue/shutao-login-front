import CryptoJS from '@/libs/encrypt'
import { cpsServerOrigin } from './domain'

export function getUA(key) {
    const aym = navigator.userAgent.match(/aym=({.*})/)
    if (aym) {
        const result = JSON.parse(aym[1])
        return result[key]
    }
    return ''
}

export const isAym = getUA('appName') === 'AYM'
export const isZjl = getUA('appName') === 'ZJL'  || getUA('appName') === 'ZJLSC'  
// 有appName并且非爱又米非招集令，都是马甲包
export const isMjb = getUA('appName') && !isAym && !isZjl

export const newerVersionThan = (verison) => {
    if (!verison) { return false }
    const appVersion = getUA('version')
    if (!appVersion) { return false }
    const curr = appVersion.split('.')
    const target = verison.split('.')
    for (let i = 0; i < curr.length; i++) {
        if (~~curr[i] < ~~target[i]) {
            return false
        }
        if (~~curr[i] > ~~target[i]) {
            return true
        }
    }
    return true
}


// 登录
export function mjbLogin(param) {
    // const isApp = navigator.userAgent.indexOf('aym=') > -1
    if (isMjb) {
        axdApp.send({
            module: 'user',
            method: 'reLogin',
            params: {
                type: 0
            },
            callback: function(ret) {
                if (ret.data && ret.data.result == 'true') {
                    setTimeout(() => {
                        axdApp.refresh()
                    }, 100)
                } else {
                    axdApp.send({
                        module: 'webview',
                        method: 'close'
                    })
                }
            }
        })
    }
}



// 登录
export function login(param) {
    // const isApp = navigator.userAgent.indexOf('aym=') > -1
    if (isApp) {
        axdApp.send({
            module: 'user',
            method: 'reLogin',
            params: {
                type: 0
            },
            callback: function(ret) {
                if (ret.data && ret.data.result == 'true') {
                    setTimeout(() => {
                        axdApp.refresh()
                    }, 100)
                } else {
                    axdApp.send({
                        module: 'webview',
                        method: 'close'
                    })
                }
            }
        })
    } else {
        let url = param && param.url ? param.url : window.location.href
        window.location.replace(domainConfig.login + '/views/login/index?cbUrl=' + encodeURIComponent(url))
    }
}


/**
 * [url违规判断]
 * @param  {[string]}    url    [url]
 * @return {[boolean]}          []
 */
export const urlIllegal = (url) => {
    return !url || (url.indexOf('http') == 0 && decodeURIComponent(url).indexOf(window.location.origin) != 0)
}

/**
 * [密码加密]
 * @param  {[string]} password [密码]
 * @return {[string]}          [加密后的密码]
 */
export const getEncryptedPsw = (password) => {
    var aixuedaiAeskey = 'YWl4dWVkYWk0MDAtODY3MQ==' // aixuedai400-8671
    let key = CryptoJS.enc.Base64.parse(aixuedaiAeskey)
    let iv = CryptoJS.enc.Base64.parse(aixuedaiAeskey)

    return CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    }).toString()
}

/**
 * [密码解密]
 * @param  {[string]} password [加密后的密码]
 * @return {[string]}          [密码]
 */
export const getDecryptedPsw = (word) => {
    var aixuedaiAeskey = 'YWl4dWVkYWk0MDAtODY3MQ==' // aixuedai400-8671
    let key = CryptoJS.enc.Base64.parse(aixuedaiAeskey)
    let iv = CryptoJS.enc.Base64.parse(aixuedaiAeskey)

    return CryptoJS.AES.decrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    }).toString(CryptoJS.enc.Utf8)
}

/**
 * [浏览器参数分割]
 * @param  {[string]} str [浏览器search]
 * @return {[object]}     [{key:value}]
 */
export const parseQuery = (query = location.search) => {
    var res = {}
    query = query.trim().replace(/^(\?|#|&)/, '')
    if (!query) {
        return res
    }
    query.split('&').forEach(function(param) {
        var parts = param.replace(/\+/g, ' ').split('=')
        var key = decodeURIComponent(parts.shift())
        var val = parts.length > 0 ? decodeURIComponent(parts.join('=')) : null

        if (res[key] === undefined) {
            res[key] = val
        } else if (Array.isArray(res[key])) {
            res[key].push(val)
        } else {
            res[key] = [res[key], val]
        }
    })
    return res
}

/**
 * [js引用]
 * @param  {[string]} js文件地址 [文件名]
 */
export function includeJs(filename) {
    var head = document.getElementsByTagName('head')[0]

    var script = document.createElement('script')
    script.src = filename
    script.type = 'text/javascript'

    head.appendChild(script)
}

/**
 * [css引用]
 * @param  {[string]} filename [filename]
 */
export function includeCss(filename) {
    var head = document.getElementsByTagName('head')[0]

    var link = document.createElement('link')
    link.href = filename
    link.rel = 'stylesheet'

    head.appendChild(link)
}

/**
 * [cookie值获取]
 * @param  {[string]} cookieName [cookie名称]
 * @return {[string]}            [cookie值]
 */
export function getCookie(cookieName) {
    let cookieStart = document.cookie.indexOf(cookieName)
    let cookieValue = null
    if (cookieStart > -1) {
        let cookieEnd = document.cookie.indexOf(';', cookieStart)
        if (cookieEnd == -1) {
            cookieEnd = document.cookie.length
        }
        cookieValue = document.cookie.substring(cookieStart + cookieName.length + 1, cookieEnd)
    }
    return cookieValue
}

/**
 * Sets the cookie.
 *
 * @param      {string}  name        The name
 * @param      {<type>}  value       The value
 * @param      {<type>}  expiredays  The expiredays
 * @param      {string}  tarDomain   The tarDomain
 */
export function setCookie(name, value, expiredays, tarDomain) {
    if (!name || !value) {
        return
    }

    if (!tarDomain) {
        tarDomain = window.location.hostname
    }

    let exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString()) + ';path=/;domain=' + tarDomain
}

/**
 * Sets the cookie.
 *
 * @param      {string}  name        The name
 * @param      {<type>}  value       The value
 * @param      {<type>}  expiredays  The expiredays
 * @param      {string}  tarDomain   The tarDomain
 */
export function setCookieSeconds(name, value, expiredays, tarDomain) {
    if (!name || !value) {
        return
    }

    if (!tarDomain) {
        tarDomain = window.location.hostname
    }

    let exdate = new Date().getTime() + expiredays
    exdate = new Date(exdate)
    document.cookie = name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString()) + ';path=/;domain=' + tarDomain
}

/**
 * [是否微信环境]
 *
 * @return     {boolean}  True if weixin, False otherwise.
 */
export function isWeixin() {
    let ua = navigator.userAgent.toLowerCase()

    if ((/MicroMessenger/i).test(ua)) {
        return true
    } else {
        return false
    }
}

/**
 * [是否QQ环境]
 *
 * @return     {boolean}  True if QQ, False otherwise.
 */
export function isQQ() {
    let ua = navigator.userAgent

    if ((/QQ\//i).test(ua)) {
        return true
    } else {
        return false
    }
}

/**
 * [是否App]
 *
 * @return     {boolean}  True if App, False otherwise.
 */
export function isApp() {
    let ua = navigator.userAgent.toLowerCase()

    if ((/native\/y/i).test(ua) || (/aym=\{/i).test(ua)) {
        return true
    } else {
        return false
    }
}

/**
 * [获取app版本号]
 *
 * @return     {string}  app version
 */
// export function getAppVersion() {
//     let ua = navigator.userAgent.toLowerCase()
//     let [version] = navigator.userAgent.match(/"version":"\d+\.+\d+\.+\d"/)
//     return version.replace(/"/g, '').substr(8).replace('.', '')
// }
export function getAppVersion() {
    let ua = navigator.userAgent.toLowerCase()
    let [version] = navigator.userAgent.match(/"version":"\d+(\.\d+){2,}"/) || []
    if (version) {
        return version.replace(/"/g, '').substr(8).replace(/\./g, '')
    } else {
        return 0
    }
}

/**
 * [前缀域名转换]
 * @param      {string}  prefix 目标域名前缀
 *
 * @return     {string}  转换后域名
 */
export function domainTransform(prefix) {
    let curDomain = window.location.hostname
    let resultDomain = curDomain.replace(/^login/, prefix)
    if (curDomain.test(/^login-/)) {
        // test environment
        resultDomain += ':8443'
    }

    return resultDomain
}

// 判断是ios设备
export function isiOS() {
    let ua = navigator.userAgent.toLowerCase()
    return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i)
}

// 判断是android设备
export function isAndroid() {
    var u = navigator.userAgent
    return !!(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1)
}
// url合法性判断
export function isSecureUrl(url) {
    let whiteList = ['aiyoumi.com', 'aicaitest.com', 'aixuedai.com', 'aicai.cloud']

    // 多层解码
    while (url.indexOf('3A%2') !== -1) {
        url = decodeURIComponent(url)
    }
    // 判断是否同域
    if (url.indexOf(window.location.origin) === 0) {
        return true
    }

    // 判断是否白名单域名
    let isSecure = false
    isSecure = whiteList.some((domain) => {
        let reg = new RegExp('^(http|https):\/\/[a-z0-9A-Z-_.]+' + domain)
        return reg.test(url)
    })

    return isSecure
}


/**
 * [格式化日期]
 * @param  dt = dateTime: type string || number || date object
 * @return type string
 */
 export function dateFormat(dt, fmt = 'yyyy-MM-dd hh:mm:ss') {
    let newDate = dt
    if (!dt) {
        return ''
    }
    if (typeof dt === 'string') {
        // dt = dt.replace(/-/g, '/') // IOS上只支持yyyy/MM/dd这种标准格式
        dt = /^\d+$/.test(dt) ? parseInt(dt) : dt.replace(/-/g, '/') // 传入的日期可能是个纯数字组成的字符串，如"1511107200000"
    }
    if (dt instanceof Date === false) {
        dt = new Date(dt)
    }
    if (!dt.getTime()) {
        return newDate
    }

    let o = {
        'M+': dt.getMonth() + 1, // 月份
        'd+': dt.getDate(), // 日
        'h+': dt.getHours(), // 小时
        'm+': dt.getMinutes(), // 分
        's+': dt.getSeconds(), // 秒
        'q+': Math.floor((dt.getMonth() + 3) / 3), // 季度
        S: dt.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }

    return fmt
}


/**
 * [全局唯一编码生成(UUID)]
 * @param  {[string]} len   [uuid生成长度]
 * @param  {[string]} radix [基数: 2、10、16进制]
 * @return {[string]}       [生成uuid]
 */
 export function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = [],
            i
    radix = radix || chars.length

    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
        var r

        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16)
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
            }
        }
    }

    return uuid.join('')
}


/**
 * [localstorage值设置]
 * @param  {[string]} name [名称]
 * @param  {[string|object]} value [值]
 * @param  {[number]} minutes [过期时间，分钟]
 * @param  {[boolean]} clearTomorrow [是否隔天过期]
 */
 export function setStorage(name, value, minutes = 0, clearTomorrow = false) {
    if(!name || !value) {
        return false
    }
    if(minutes && typeof minutes === 'number') {
        let expires
        const expiresTime = new Date().getTime() + minutes * 60000
        if(clearTomorrow) {
            const tomorrowTime = new Date(new Date().toLocaleDateString()).getTime() + 1440 * 60000
            expires = Math.min(tomorrowTime, expiresTime)
        } else {
            expires = expiresTime
        }
        window.localStorage.setItem(name, JSON.stringify({expires, value}))
    } else {
        window.localStorage.setItem(name, JSON.stringify({value}))
    }
}

export function getStorage(name) {
    if(!name) {
        return null
    }
    const JsonData = window.localStorage.getItem(name)
    try {
        let data = JSON.parse(JsonData)
        if(data.expires) {
            if(data.expires >= new Date().getTime()) {
                return data.value
            } else {
                window.localStorage.removeItem(name)
                return null
            }
        } else {
            return data.value
        }
    } catch (error) {
        return JsonData
    }
}

export function goProtocal(id) {
    const url = `https://opengateway-contract.zhaojiling.com/mng/template/view/${id}`
    if (isApp()) {
        axdApp.send({
            module: 'navigation',
            method: 'goURL',
            params: {
                url,
                rootPage: 0
            }
        })
    } else {
        window.open(url)
    }
}