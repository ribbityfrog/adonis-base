// import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import User from '#models/accounts/user'

export default class ConnectionsController {
  async login() {
    const user = await User.first()

    user!.lastConnection = DateTime.now()
    await user?.save()

    return await User.accessTokens.create(user!)
  }
}
