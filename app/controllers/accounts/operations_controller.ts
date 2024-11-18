import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import string from '@adonisjs/core/helpers/string'
import Operation from '#models/accounts/operation'
import User from '#models/accounts/user'
import Except from '#utils/except'

export default class OperationsController {
  async requestLogin({ request }: HttpContext) {
    const body = request.body()

    const user = await User.getWithOperations(body.email)
    if (user === null) return

    await user.clearOperations('connect')

    const searchKey = await Operation.createSearchKey()
    if (searchKey === undefined)
      return Except.internalServerError('http', { debug: 'Could not generate connection' })

    const verificationKey = string.random(16)

    await user.related('operations').create({
      operationType: 'connect',
      searchKey,
      verificationKey: await hash.make(verificationKey),
    })

    console.log(
      `Email: ${body.email} - Search Key: ${searchKey} - Verification Key: ${verificationKey}`
    )

    return
  }

  async login({ request }: HttpContext) {
    const body = request.body()

    const operation = await Operation.getFromKeys(body.searchKey, 'connect')
    if (operation === null)
      return Except.entryNotFound('http', { debug: 'Account Operation not foun' })

    const checkHash = await hash.verify(operation.verificationKey, body.verificationKey)
    if (checkHash === false)
      return Except.unauthorized('http', { debug: 'Invalid verification key' })

    const token = await User.accessTokens.create(operation.user)
    operation.user.lastConnection = DateTime.now()
    await operation.user.save()
    await operation.delete()

    return token
  }
}
