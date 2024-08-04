import {
    _postPromise,
    _getPromise
} from './base'

export const getPageInit = (param) => {
    return _getPromise('/oauth2/page/init', param, {})
}

export const userConfirm = (param) => {
    return _postPromise('/oauth2/user/confirm', param, {})
}
