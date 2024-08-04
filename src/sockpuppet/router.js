const App = () => import('src/module/App.vue')
const Auth = () => import('./auth.vue')
const Resetphone = () => import('./resetphone/index.vue')
const ResetphoneVerify = () => import('./resetphone/verify.vue')
const ResetphoneConfirm = () => import('./resetphone/confirm.vue')

export default [{
    path: '/sockpuppet',
    component: App,
    children: [{
        path: 'auth',
        component: Auth,
        name: 'sockpuppetAuth',
        meta: {
            title: '授权登录'
        }
    }, {
        path: 'resetphone',
        component: Resetphone,
        name: 'sockpuppetResetphone',
        meta: {
            title: '换绑账号'
        }
    }, {
        path: 'resetphone/verify',
        component: ResetphoneVerify,
        name: 'sockpuppetResetphoneVerify',
        meta: {
            title: '换绑账号'
        }
    }, {
        path: 'resetphone/confirm',
        component: ResetphoneConfirm,
        name: 'sockpuppetResetphoneConfirm',
        meta: {
            title: '换绑账号'
        }
    }]
}]
