import type { HttpContext } from '@adonisjs/core/http'

import Operation from '#models/accounts/operation'
import mailer from '#services/thirds/mailer'
import magicLink from '#utils/magic_link'

export default class ProfilesController {
  async get({ auth }: HttpContext) {
    return { email: auth.user!.email }
  }

  async updatePassword({ request, auth }: HttpContext) {
    auth.user!.password = request.body().password.trim()
    await auth.user!.save()
  }

  async updateEmail({ auth, request }: HttpContext) {
    const email = request.body().email.trim().toLowerCase()

    const operationKeys = await Operation.createForUser(auth.user!, 'update-email', { email })

    await mailer.transactional?.sendProfileUpdateEmail(auth.user!.email, {
      MLINK: magicLink('update-email', operationKeys),
    })
  }

  async delete({ auth }: HttpContext) {
    await auth.user?.delete()
  }
}
