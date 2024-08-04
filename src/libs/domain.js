/**
 * 跳转域名转换
 */
 const userDomain = {
    prefix: 'user', 
}

// 前端埋点上报
const logServerDomain = {
    prefix: 'log', 
}

const cpsH5Domain = {
    prefix: 'm', 
}

const gatewayServerDomain = {
    prefix: 'api-gateway', 
}

const monitorServerDomain = {
    prefix: 'api-gateway'
}

//--

// 当前应用域名前缘
const curSysPrefix = 'login'
// 通用跳转域名转换
const getDomain = (config) => {
    let curDomain = window.location.hostname
    let protocol = window.location.protocol + '//'
    // 跳转URL转换
    let targetDomain = curDomain.replace(/^fe-/, '').replace(new RegExp('^(' + curSysPrefix + ')'), config.prefix)

    // dev/测试环境 & 线上
    if (import.meta.env.PROD) {
        // dev/测试环境
        if (/(dev|shuyaotest)/.test(curDomain)) {
            return protocol + targetDomain
        } else {
            // 线上环境（永远不要动）
            return protocol + targetDomain
        }
    } else {
        /**
         * 本地开发，跳转地址转换
         */
        // 代理syao环境
        if (/-syao/.test(targetDomain)) {
            return 'https://' + targetDomain
        }
        // 代理生产环境
        if (/-prod/.test(targetDomain)) {
            return 'https://' + targetDomain.replace(/-prod/, '')
        }
        // 代理dev
        if (/-dev/.test(targetDomain)) {
            return protocol + targetDomain.replace(/-(dev)/, '.$1')
        }
        return ''
    }
}

// 外放地址转换方法
export const urlHandler = (preUrl) => {
    let targetUrl = ''
    // 根据接口前缀转发到不同域名
    if (preUrl.indexOf('http') === 0) {
        targetUrl = preUrl
    }  else if (preUrl.indexOf('/cms/') === 0) {
        targetUrl = getDomain(cpsH5Domain) + preUrl
    }  else {
        targetUrl = getDomain(userDomain) + preUrl
    }
    return targetUrl
}

export const gatewayServerOringin = getDomain(gatewayServerDomain)
export const logServerOrigin = getDomain(logServerDomain) 
export const monitorServer = getDomain(monitorServerDomain)
export const cpsServerOrigin = getDomain(cpsH5Domain) 

