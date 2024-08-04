const App = () => import('src/module/App.vue')
// 登录相关内容
const index = () => import('src/module/login/index.vue')
const smsLogin = () => import('src/module/login/smslogin/index.vue')
const smsCheck = () => import('src/module/login/smslogin/smscheck.vue')
const pwdLogin = () => import('src/module/login/pwdlogin/index.vue')
const apiLogin = () => import('src/module/login/apilogin/index.vue')

export default [{
    path: '/views/login/',
    alias: '/',
    component: App,
    redirect: '/views/login/index',
    children: [{
        path: 'index',
        component: index,
        name: 'index',
        meta: {
            title: '登录',
            code: '210035001'
        }
    }, {
        path: 'smsLogin',
        component: smsLogin,
        name: 'smsLogin',
        meta: {
            title: '短信登录'
        }
    }, {
        path: 'smsCheck',
        component: smsCheck,
        name: 'smsCheck',
        meta: {
            title: '短信登录验证'
        }
    }, {
        path: 'pwdLogin',
        component: pwdLogin,
        name: 'pwdLogin',
        meta: {
            title: '账号密码登录'
        }
    }, {
        path: 'api',
        component: apiLogin,
        name: 'apiLogin',
        meta: {
            title: '授权登录'
        }
    }]
}]
