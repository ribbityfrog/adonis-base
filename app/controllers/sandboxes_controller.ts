// import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import string from '@adonisjs/core/helpers/string'

export default class SandboxesController {
  async sand() {
    // const vkey = string.random(8)
    const vkey = 'coucou'

    return await hash.make(vkey)
  }
}
