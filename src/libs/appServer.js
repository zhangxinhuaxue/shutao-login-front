
function reload() {
    setTimeout(function () {
        axdApp.refresh()
    }, 300)
}


export function isapp() {
    return /aym/.test(navigator.userAgent)
}

export function login() {
    axdApp.send({
        module: 'user',
        method: 'login',
        params: {
            type: 0
        },
        callback(ret) {
            reload()
        }
    })
}