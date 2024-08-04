import routerLogin from './routers/router_login'
import routerUsercenter from './routers/router_usercenter'
import routerWechat from './routers/router_wechat_active'
import routeAccountLogout from './routers/router_account_logout'
import routeOauth from './routers/router_oauth'
import sockpuppet from '../sockpuppet/router'
const NotFound = () => import('src/404.vue')

let routerOther = [{
    path: '*',
    component: NotFound,
    name: 'notfound',
    meta: {
        title: '404-I GOT LOST'
    }
}]

const routerConfig = [
    ...routerLogin,
    ...routerUsercenter,
    ...routeAccountLogout,
    ...routerWechat,
    ...sockpuppet,
    ...routeOauth,
    ...routerOther
]

export default routerConfig
