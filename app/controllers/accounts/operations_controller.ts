import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import Operation from '#models/accounts/operation'
import User from '#models/accounts/user'
import Except from '#utils/except'
import magicLink from '#utils/magic_link'

export default class OperationsController {
  async requestLogin({ request }: HttpContext) {
    const body = request.body()

    const user = await User.getWithOperations(body.email)
    if (user === null) return

    await user.clearOperations('connect')

    const operationKeys = await Operation.createForUser(user, 'connect')
    if (operationKeys === null)
      return Except.internalServerError('http', { debug: 'Failed to create connect operation' })

    console.log(`PH_EMAIL Email: ${user.email} - Link: ${magicLink('connect', operationKeys)}`)
  }

  async login({ request }: HttpContext) {
    const body = request.body()

    const operation = await Operation.getFromKeys(body.searchKey, 'connect')
    if (operation === null) return Except.forbidden()

    if (operation.createdAt.plus({ minutes: 5 }) <= DateTime.now()) {
      await operation.delete()
      return Except.forbidden()
    }

    const checkHash = await hash.verify(operation.verificationKey, body.verificationKey)
    if (checkHash === false) {
      await operation.delete()
      return Except.forbidden()
    }

    const token = await User.accessTokens.create(operation.user)
    operation.user.lastConnection = DateTime.now()
    await operation.user.save()
    await operation.delete()

    return token
  }
}
