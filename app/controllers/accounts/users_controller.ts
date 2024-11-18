// import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/accounts/user'
import db from '@adonisjs/lucid/services/db'

export default class UsersController {
  async list() {
    return await User.all()
  }
}
