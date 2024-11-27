import User from '#models/accounts/user'
import Except from '#utils/except'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ConnectionsController {
  async list() {
    return await db.from('accounts.connections').select(['id', 'name'])
  }

  async listSelf({ auth }: HttpContext) {
    if (!auth?.user) {
      Except.entryNotFound()
      return
    }
    return await db
      .from('accounts.connections')
      .select(['id', 'name'])
      .where('tokenable_id', auth.user.id)
  }

  async logout({ auth }: HttpContext) {
    if (!auth?.user) {
      Except.entryNotFound()
      return
    }
    // return await db
    //   .from('accounts.connections')
    //   .where('tokenable_id', auth.user.currentAccessToken.identifier)
    //   .delete()
    return await User.accessTokens.delete(auth.user, auth.user.currentAccessToken.identifier)
  }
}
