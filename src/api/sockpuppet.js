import { _postPromise, _getPromise } from './base'
import { gatewayServerOringin } from '@/libs/domain'

export const getUserStatus = param => _getPromise('/sockpuppet/auth/login', param)

export const sendMsgCode = param => _postPromise('/sockpuppet/updatePhone/sendMsg', param)
export const resetphoneSubmit = param => _postPromise('/sockpuppet/updatePhone/confirm', param)
export const resetphoneResult = param => _postPromise('/sockpuppet/updatePhone/result', param)

export const SUBMIT_FACE = params => _postPromise(gatewayServerOringin + '/comm_h5/common/vivo/match', params)