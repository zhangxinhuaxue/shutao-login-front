const App = () => import('src/module/App.vue')
const oauh = () => import('src/module/oauth/index.vue')

export default [{
    path: '/views/oauth',
    component: App,
    redirect: 'auth',
    children: [{
        path: 'login',
        component: oauh,
        name: 'login',
        meta: {
            title: '授权登录'
        }
    }]
}]
