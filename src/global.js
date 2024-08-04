/**
 *
 * @author:      zhouqing
 * @dateTime:    2017-7-3 11:55:02
 * @description:
 */
import { isApp, isMjb } from '@/libs/utils'
import textEnum from '@/libs/text.enum'
import { accessLog } from '@/libs/accessLog'
import { Actionsheet, Button, Input, CellGroup, Cell, Dialog, Page, Toast, Style, Icon } from '@fe/aym-ui'

const install = function(Vue, config = {}) {
    Vue.config.devtools = import.meta.env.DEV
    Vue.prototype.isApp = isApp
    Vue.prototype.isMjb = isMjb
    Vue.prototype.ERRORTXT = textEnum.ERROR
    Vue.prototype.log = accessLog

    Vue.use(Actionsheet)
    Vue.use(Button)
    Vue.use(Input)
    Vue.use(Icon)
    Vue.use(CellGroup)
    Vue.use(Cell)
    Vue.use(Dialog)
    Vue.use(Toast)
    Vue.use(Page)
    Vue.use(Style)
}

export { install }
