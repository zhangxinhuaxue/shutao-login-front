import {
    getCookie
} from 'src/libs/utils'

export const goReset = (type = 'phone', phoneNo = '', step = 'step1') => {
    let targetPath = (type === 'phone' ? 'resetPhone' : 'resetPwd') + '/' + step
    let jumpUrl = '/views/userCenter/' + targetPath
    if (window.location.search) {
        jumpUrl += window.location.search
        if (!/phoneNo=\d{11}/.test(jumpUrl) && phoneNo) {
            jumpUrl += '&phoneNo=' + phoneNo
        }
    } else {
        if (phoneNo) {
            jumpUrl += '?phoneNo=' + phoneNo
        }
    }

    window.location.href = jumpUrl
}

export const urlDebugHandler = (cburl) => {
    let cat = getCookie('cat')
    if (cburl.indexOf('cat=true' !== -1)) {
        return cburl.replace('cat=true', 'cat=' + cat) // cburl + 'cat=' + cat
    } else {
        return cburl
    }
}
