import type { OperationType } from '#models/accounts/types'
import type { OperationKeys } from '#schemas/accounts/operation'
import env from '#start/env'

export default (operationType: OperationType, keys: OperationKeys): string | undefined => {
  let link

  if (operationType === 'connect') link = env.get('MAGIC_CONNECT')

  if (link === undefined) return link

  link += `/${keys.searchKey}/${keys.verificationKey}`
  return link
}
