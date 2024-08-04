import { urlIllegal, isApp } from './utils'

// 用户密码
const testPwd = (value) => {
    let regPassword = /^(?=.*\d)(?=.*[A-Za-z]).{8,16}$/g
    return regPassword.test(value)
}

// 兼容原来6位密码的用户
const testNumPwd = (value) => {
    let regPassword = /^\d{6}$/g
    return regPassword.test(value)
}

// 短信验证码
const testVcode = (value) => {
    let regVcode = /^\d{6}$/
    return regVcode.test(value)
}

// 图片验证码
const testImgCode = (value) => {
    let regImgCode = /^[A-Za-z\d]{4}$/
    return regImgCode.test(value)
}

// 手机号
const testTelphone = (value) => {
    let regPhone = /^1\d{10}$/
    return regPhone.test(value)
}

// 身份证号
const testIdNum = (value) => {
    let redIdNum = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return redIdNum.test(value)
}

// 银行卡号
const testBankCardNO = (value) => {
    let regCardNO = /^\d{16,21}$/
    return regCardNO.test(value)
}

// 用户注册协议
const regProto = 'https://m.zhaojiling.com/h5/user/contract/viewPublicTemplate/userRegistration'

export { testTelphone, testPwd, testNumPwd, testImgCode, testVcode, regProto, testIdNum, testBankCardNO }
