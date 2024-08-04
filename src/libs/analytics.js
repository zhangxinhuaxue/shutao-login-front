/* globals _hmt */
// https://tongji.baidu.com/web/help/article?id=219&type=0
function appendScript(id) {
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://hm.baidu.com/hm.js?' + id
    document.body.appendChild(script)
}

function init(id) {
    if (!window._hmt) {
        appendScript(id)
        window._hmt = window._hmt || []

        // _hmt.push(['_setAccount', id])
    }
}

function collect(url, id) {
    init(id)

    // _hmt.push(['_setAutoPageview', false])
    _hmt.push(['_trackPageview', url])
}

export default function(router, id) {
    if (typeof router === 'function') {
        router(url => {
            collect(url, id)
        })
    } else {
        router.afterEach(to => {
            collect(to.fullPath, id)
        })
    }
}
