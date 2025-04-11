import type { HttpContext } from '@adonisjs/core/http'

import Operation from '#models/accounts/operation'

import type { OperationKeys } from '#schemas/accounts/operation'
import db from '@adonisjs/lucid/services/db'

export default class OperationsController {
  async connect({ request }: HttpContext) {
    const opeKeys = request.body() as OperationKeys

    const operation = await Operation.useOrFail(opeKeys, 'connect')

    const token = await operation.user.createToken(true)
    await operation.delete()

    return token
  }

  async updateEmail({ request }: HttpContext) {
    const opeKeys = request.body() as OperationKeys

    const operation = await Operation.useOrFail(opeKeys, 'update-email')

    operation.user.email = operation.data.email
    await operation.user.save()
    await db.query().from('accounts.connections').where('tokenable_id', operation.user.id).delete()
    await operation.delete()
  }
}
