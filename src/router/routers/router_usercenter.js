const App = () => import('src/module/App.vue')
// 用户中心相关内容 （更换手机号、找回密码等等）
const ucChannels = () => import('src/module/usercenter/infoverify/verifychannels.vue')
const ucSelfVerify = () => import('src/module/usercenter/infoverify/selfverify.vue')
const ucCardVerify = () => import('src/module/usercenter/infoverify/cardverify.vue')
const ucIDCardVerifyResult = () => import('src/module/usercenter/infoverify/faceresult.vue')
// 更换手机号
const resetPhoneStep1 = () => import('src/module/usercenter/resetphone/index.vue')
const resetPhoneStep2 = () => import('src/module/usercenter/resetphone/reset_step2.vue')
const resetPhoneStep3 = () => import('src/module/usercenter/resetphone/reset_step3.vue')
const resetPhoneStep4 = () => import('src/module/usercenter/resetphone/reset_step4.vue')
const resetPhoneStepUserID = () => import('src/module/usercenter/resetphone/reset_userid.vue')
// 忘记密码
const resetPwdStep1 = () => import('src/module/usercenter/resetpwd/index.vue')
const resetPwdStep2 = () => import('src/module/usercenter/resetpwd/reset_step2.vue')
const resetPwdStep3 = () => import('src/module/usercenter/resetpwd/reset_step3.vue')
const resetPwdStep4 = () => import('src/module/usercenter/resetpwd/reset_step4.vue')

// 账户与绑定设置
const accountBind = () => import('src/module/usercenter/mine/accountbindinfo.vue')

export default [{
    path: '/views/userCenter/',
    component: App,
    redirect: 'channels',
    children: [{
        path: 'channels',
        component: ucChannels,
        name: 'channels',
        meta: {
            title: '身份验证'
        }
    }, {
        path: 'selfVerify',
        component: ucSelfVerify,
        name: 'selfVerify',
        meta: {
            title: '自助申诉'
        }
    }, {
        path: 'cardVerify',
        component: ucCardVerify,
        name: 'cardVerify',
        meta: {
            title: '银行卡验证'
        }
    }, {
        path: 'ucIDCardVerifyResult',
        component: ucIDCardVerifyResult,
        name: 'ucIDCardVerifyResult',
        meta: {
            title: '活体检测结果'
        }
    }, {
        path: 'resetPwd/step1',
        component: resetPwdStep1,
        name: 'resetPwdStep1',
        meta: {
            title: '忘记密码'
        }
    }, {
        path: 'resetPwd/step2',
        component: resetPwdStep2,
        name: 'resetPwdStep2',
        meta: {
            title: '忘记密码'
        }
    }, {
        path: 'resetPwd/step3',
        component: resetPwdStep3,
        name: 'resetPwdStep3',
        meta: {
            title: '忘记密码'
        }
    }, {
        path: 'resetPwd/step4',
        component: resetPwdStep4,
        name: 'resetPwdStep4',
        meta: {
            title: '忘记密码'
        }
    }, {
        path: 'resetPhone/step1',
        component: resetPhoneStep1,
        name: 'resetPhoneStep1',
        meta: {
            title: '更换手机号'
        }
    }, {
        path: 'resetPhone/step2',
        component: resetPhoneStep2,
        name: 'resetPhoneStep2',
        meta: {
            title: '更换手机号'
        }
    }, {
        path: 'resetPhone/step3',
        component: resetPhoneStep3,
        name: 'resetPhoneStep3',
        meta: {
            title: '更换手机号'
        }
    }, {
        path: 'resetPhone/step4',
        component: resetPhoneStep4,
        name: 'resetPhoneStep4',
        meta: {
            title: '更换手机号'
        }
    }, {
        path: 'resetPhone/step_identifyId',
        component: resetPhoneStepUserID,
        name: 'resetPhoneStepUserID',
        meta: {
            title: '更换手机号'
        }
    }, {
        path: 'mine/settingsBind',
        component: accountBind,
        name: 'accountBind',
        meta: {
            title: '账户与绑定设置'
        }
    }]
}]
