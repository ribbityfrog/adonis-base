import type { OperationType } from '#schemas/accounts/types'
import type { OperationKeys } from '#schemas/accounts/operation'
import env from '#start/env'

export default function magicLink(operationType: OperationType, keys: OperationKeys): string {
  return `${env.get('FRONT_ORIGIN', 'FRONT_ORIGIN_MISSING')}/ope/${operationType}/${keys.searchKey}/${keys.verificationKey}`
}
