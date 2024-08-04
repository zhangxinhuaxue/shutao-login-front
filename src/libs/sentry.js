import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

// 非开发环境下
if (import.meta.env.PROD) {
    // 正式、测试环境各一套
    let dsn = /login\.zhaojiling/.test(window.location.hostname) ? 'https://8a1fce1bb1ce4d59bd3b86f50418c956@sentry.aiyoumi.com/4' : 'https://d66aa9324b9a47ed87debf69cd9b6f6d@sentry.aiyoumi.com/5'
    Sentry.init({
        dsn,
        integrations: [new Integrations.Vue({ Vue, attachProps: true })],
        ignoreErrors: [
            'Argument 1 (\'options\') to RTCPeerConnection.createOffer must be a dictionary',
            'hasInject is not defined' // andriod
        ],
        denyUrls: [
            /qq\.com/i,
            /baidu\.com/i,
            /vendors\.js/,
            /frms-fingerprint\.js/,
            /frms-fingerprint-min\.js/
        ]
    })

    Sentry.setTag('service', 'aicai-static-login')
    // 挂载全局
    window.Sentry = Sentry
}
