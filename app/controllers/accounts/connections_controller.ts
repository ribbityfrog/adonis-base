import User from '#models/accounts/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ConnectionsController {
  async logout({ auth }: HttpContext) {
    await User.accessTokens.delete(auth.user!, auth.user!.currentAccessToken.identifier)
  }
}
