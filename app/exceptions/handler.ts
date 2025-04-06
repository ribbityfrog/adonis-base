import app from '@adonisjs/core/services/app'
import { ExceptionHandler } from '@adonisjs/core/http'
import Except from '#utils/except'
import { exceptIntelsSchema } from '#utils/except/types'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any) {
    if (error?.code === 'E_ROUTE_NOT_FOUND') Except.routeNotFound()

    if (!exceptIntelsSchema.safeParse(error?.body).success)
      return Except.internalServerError({ debug: { type: error.type, message: error.message } })

    // return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  // async report(error: unknown, ctx: HttpContext) {
  // return super.report(error, ctx)
  // }
}
