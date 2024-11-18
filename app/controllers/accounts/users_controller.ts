import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/accounts/user'
import Operation from '#models/accounts/operation'
import magicLink from '#utils/magic_link'
import Except from '#utils/except'

export default class UsersController {
  async create({ request }: HttpContext) {
    const body = request.body()

    const checkUser = await User.findBy('email', body.email)
    const user = checkUser !== null ? checkUser : await User.create({ email: body.email })

    const operationKeys = await Operation.createForUser(user, 'connect')
    if (operationKeys === null) return Except.internalServerError()

    if (checkUser !== null)
      console.log(`User exists: ${user.email} - Link: ${magicLink('connect', operationKeys)}`)
    else console.log(`New user: ${user.email} - Link: ${magicLink('connect', operationKeys)}`)
  }

  async list() {
    return await User.all()
  }
}
