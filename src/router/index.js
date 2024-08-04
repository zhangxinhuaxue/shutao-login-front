import Vue from 'vue'
import VueRouter from 'vue-router'
import configRouter from './router-table'
import { accessLogUtil } from 'src/libs/accessLog'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: configRouter,
    linkActiveClass: 'active'
})


router.beforeEach((to, from, next) => {
    document.title = to.meta.title || '钥信记'
    // 跳转页面前开始时间等逻辑处理
    accessLogUtil.beforeRoute()
    next()
})

router.afterEach((to, from) => {
    // 埋点进入页面后逻辑处理
    accessLogUtil.afterRoute(to, from)
})

export default router
