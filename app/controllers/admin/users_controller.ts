// import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/accounts/user'

export default class UsersController {
  async list() {
    return await User.query().select(
      'id',
      'email',
      'isVerified',
      'isBanned',
      'isAdmin',
      'lastConnection',
      'createdAt'
    )
  }
}
