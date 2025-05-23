import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/accounts/user'

import mailer from '#services/thirds/mailer'
import Operation from '#models/accounts/operation'
import Except from '#utils/except'
import magicLink from '#utils/magic_link'

import mailChecker from 'mailchecker'

export default class RequestsController {
  async create({ request }: HttpContext) {
    const body = request.body()

    const email = body.email.trim().toLowerCase()
    const password = body.password.trim()

    if (!mailChecker.isValid(email)) return

    const checkUser = await User.findBy('email', email)
    const user = checkUser ?? (await User.create({ email, password }))

    const operationKeys = await Operation.createForUser(user, 'connect')

    if (!checkUser)
      await mailer.transactional?.sendAccountCreate(user.email, {
        MLINK: magicLink('connect', operationKeys),
      })
  }

  async login({ request }: HttpContext) {
    const body = request.body()

    const email = body.email.trim().toLowerCase()
    const password = body.password.trim()

    const user = await User.verifyCredentials(email, password).catch(() => {
      throw Except.imATeapot()
    })

    if (!user || !user.isVerified) return Except.imATeapot()

    if (user.isBanned) {
      await mailer.transactional?.sendAccountBanned(user.email)
      return Except.imATeapot()
    }

    return await user.createToken()
  }

  async loginPasswordless({ request }: HttpContext) {
    const email = request.body().email.trim().toLowerCase()

    const user = await User.findBy('email', email)
    if (!user) return

    if (user.isBanned) {
      await mailer.transactional?.sendAccountBanned(user.email)
      return
    }

    const operationKeys = await Operation.createForUser(user, 'connect')

    await mailer.transactional?.sendAccountConnect(user.email, {
      MLINK: magicLink('connect', operationKeys),
    })
  }
}
