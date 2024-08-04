const App = () => import('src/module/App.vue')
// 微信授权登录
const auth = () => import('src/module/wechat/auth.vue')
const bindinfo = () => import('src/module/wechat/bindinfo.vue')

export default [{
    path: '/views/wechat',
    component: App,
    redirect: 'auth',
    children: [{
        path: 'auth',
        component: auth,
        name: 'auth',
        meta: {
            title: ''
        }
    }, {
        path: 'bindinfo',
        component: bindinfo,
        name: 'bindinfo',
        meta: {
            title: '账号绑定'
        }
    }]
}]
