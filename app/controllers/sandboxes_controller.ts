// import type { HttpContext } from '@adonisjs/core/http'

import mailer from '#services/mailer'

export default class SandboxesController {
  async sand() {
    return (await mailer.sendTest()) === true
  }
}
