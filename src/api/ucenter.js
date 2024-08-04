/**
 * 存放用户中心接口
 */
import {
    _postPromise,
    _getPromise
} from './base'

// 获取appID和appSecret
export const getAppId = (param) => {
    return _getPromise('/login/weChat/getWeChatParam', param, {})
}

// 绑卡验证接口
export const bindCardCheck = (param) => {
    return _postPromise('/uc/bindcard/bindCard', param, {})
}
// 绑卡验证接口
export const sendBindCardSms = (param) => {
    return _postPromise('/uc/bindcard/sendBindCardSms', param, {})
}
// 获取用户信息
export const getUserInfo = (param) => {
    return _postPromise('/uc/bindcard/getUserInfo', param, {})
}
// 修改密码确认接口
export const resetPwdConfirm = (param) => {
    return _postPromise('/uc/account/resetPwdConfirm', param, {})
}
// 发送短信验证码
export const sendSmsCode = (param) => {
    return _postPromise('/uc/common/sendSmsCode', param, {})
}
// 校验短信验证码
export const checkSmsCode = (param) => {
    return _postPromise('/uc/common/checkSmsCode', param, {})
}
// 获取验证渠道
export const getVerifyChannel = (param) => {
    return _postPromise('/uc/account/getVerifyChannel', param, {})
}
// 更新手机号
export const updatePhoneNo = (param) => {
    return _postPromise('/uc/account/updatePhoneNo', param, {})
}
// 更新手机号 判断用户是否已有授信及绑卡信息
export const getPhoneRegInfo = (param) => {
    return _postPromise('/uc/common/getPhoneRegInfo', param, {})
}
// 忘记密码 获取token
export const getPhoneToken = (param) => {
    return _postPromise('/uc/common/phone/token', param, {})
}
// 获取账号绑定情况
export const getBindSettings = (param) => {
    return _postPromise('/uc/account/getBindSettings', param, {})
}
// 解绑微信QQ
export const unBindThirdOpenid = (param) => {
    return _postPromise('/uc/account/unBindThirdOpenid', param, {})
}
// 验证身份证号获取手机号
export const validateIdentifyID = (param) => {
    return _getPromise('/uc/common/identity/validate', param, {})
}

// 获取活体检测结果
export const getFaceCheckResult = (param) => {
    return _getPromise('/uc/vivo/result/get', param, {})
}
