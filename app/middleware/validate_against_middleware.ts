import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { ZodType } from 'zod'

export default class ValidateAgainstMiddleware {
  async handle({ request, params, response }: HttpContext, next: NextFn, options: ZodType) {
    const against = ['GET', 'DELETE'].includes(request.method()) ? params : request.body()

    const parseResult = options.safeParse(against)

    if (parseResult.success === false) return response.unprocessableEntity()

    await next()
  }
}
