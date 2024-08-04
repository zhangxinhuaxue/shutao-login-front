import {
    _postPromise,
    _getPromise
} from './base'

// 获取appID和appSecret
export const getAppId = (param) => {
    return _getPromise('/login/weChat/getWeChatParam', param, {})
}

// 根据code获取accessToken
export const getWeChatInfo = (param) => {
    return _postPromise('/login/weChat/weChatInfo', param, {})
}

// 根据code获取accessToken
export const bindUser = (param) => {
    return _postPromise('/login/weChat/bindLogin', param, {showLoading: true})
}

// CMS配置信息
export const renderDataForBlockType = (param) => {
    return _postPromise('/cms/renderDataForBlockType', param, {})
}

// CMS配置信息
export const renderData = (param) => {
    return _getPromise('/cms/renderData', param, {})
}

// SMS短信
export const sendCodeMsg = (param) => {
    return _postPromise('/login/common/sendCodeMsg', param)
}

// SMS登录
export const smsLogin = (param) => {
    return _postPromise('/login/doSmsLogin', param, {showLoading: true})
}

// 密码登录
export const doLogin = (param) => {
    return _postPromise('/login/doLogin', param, {})
}

// api登录
export const apiLogin = (param) => {
    return _postPromise('/login/openapi/token/check', param, {})
}

// 获取QQ的appid
export const getQQParam = (param) => {
    return _postPromise('/login/qq/getQQParam', param, {})
}

// 获取QQ的ticket
export const getQQInfo = (param) => {
    return _postPromise('/login/qq/qqInfo', param, {})
}
