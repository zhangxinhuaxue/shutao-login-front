const App = () => import('src/module/App.vue')

const logout = () => import('src/module/account/logout/logout.vue')
const logoutResult = () => import('src/module/account/logout/result.vue')

export default [{
    path: '/views/account/',
    component: App,
    redirect: '/views/account/logout',
    children: [{
        path: 'logout',
        component: logout,
        name: 'logout',
        meta: {
            title: '账户注销'
        }
    }, {
        path: 'logoutResult',
        component: logoutResult,
        name: 'logoutResult',
        meta: {
            title: '账户注销'
        }
    }]
}]
