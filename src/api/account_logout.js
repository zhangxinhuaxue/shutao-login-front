import {
    _postPromise,
    _getPromise
} from './base'

// 刷脸注销结果获取
export const logoutResult = (param) => {
    return _getPromise('/uc/vivo/cancel/result', param, { showLoading: true })
}

// 获取刷脸注销的地址
export const getaddr = (param, callback) => {
    return _getPromise('/uc/vivo/cancel/addr', param, { showLoading: true })
}
