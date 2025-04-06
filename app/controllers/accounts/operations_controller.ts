import type { HttpContext } from '@adonisjs/core/http'

import Operation from '#models/accounts/operation'

import type { OperationKeys } from '#schemas/accounts/operation'

export default class OperationsController {
  async connect({ request }: HttpContext) {
    const opeKeys = request.body() as OperationKeys

    const operation = await Operation.useOrFail(opeKeys, 'connect')

    const token = await operation.user.createToken(true)
    await operation.delete()

    return token
  }

  async updateEmail() {}

  // async newEmail({ auth, request }: HttpContext) {
  //   if (!auth?.user) return Except.forbidden()

  //   const operationKeys = await Operation.createForUser(auth.user, 'newEmail', request.body())
  //   if (operationKeys === null)
  //     return Except.internalServerError('http', { debug: 'Failed to create new email operation' })

  //   await mailer.transactional?.sendNewEmail(auth.user.email, 'fr', {
  //     MLINK: magicLink('newEmail', operationKeys),
  //   })
  // }
}
