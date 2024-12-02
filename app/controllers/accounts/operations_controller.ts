import type { HttpContext } from '@adonisjs/core/http'
import Operation from '#models/accounts/operation'
import User from '#models/accounts/user'
import Except from '#utils/except'
import magicLink from '#utils/magic_link'

import mailer from '#services/mailer'

export default class OperationsController {
  async login({ request }: HttpContext) {
    const body = request.body()

    const user = await User.getWithOperations(body.email)
    if (user === null) return

    const operationKeys = await Operation.createForUser(user, 'connect')
    if (operationKeys === null)
      return Except.internalServerError('http', { debug: 'Failed to create connect operation' })

    await mailer.sendConnect(user.email, {
      CONNECT: magicLink('connect', operationKeys),
    })
  }
}
