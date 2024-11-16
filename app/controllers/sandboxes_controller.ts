// import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import string from '@adonisjs/core/helpers/string'

export default class SandboxesController {
  async sand() {
    // const slug = string.slug(string.random(12))
    const slug = '35MOBeRY4dA9'
    const vkey = await hash.make(slug)

    console.log(slug)
    console.log(vkey)
    console.log(await hash.verify(vkey, slug))

    return 'done'
  }
}
