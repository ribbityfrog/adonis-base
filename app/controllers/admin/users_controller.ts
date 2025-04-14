import type { HttpContext } from '@adonisjs/core/http'

import db from '@adonisjs/lucid/services/db'
import User from '#models/accounts/user'

export default class UsersController {
  async list() {
    return await User.query()
      .select('id', 'email', 'isVerified', 'isBanned', 'isAdmin', 'lastConnection', 'createdAt')
      .orderBy('email', 'asc')
  }

  async update({ request }: HttpContext) {
    const body = request.body()

    const id = body.id
    delete body.id

    await User.query().where('id', id).update(body)
  }

  async disconnect({ params }: HttpContext) {
    await db.query().from('accounts.connections').where('tokenable_id', params.id).delete()
  }
}
