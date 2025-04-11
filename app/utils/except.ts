import { HttpContext } from '@adonisjs/core/http'
import logger from '@adonisjs/core/services/logger'
import { ExceptIntels } from '#utils/except/types'
import type { ExceptAbort } from '#utils/except/types'
import discordMessage from './discord_message.js'

type OptionalData = {
  debug?: any
  payload?: any
}

export default class Except {
  private _intels: ExceptIntels
  private _trace: Error
  private _ctx: HttpContext | null
  private _abort: ExceptAbort
  private _debug?: any
  private _payload?: any

  get isHttpContext(): boolean {
    return this._ctx !== null
  }

  get intels(): ExceptIntels {
    return this._intels
  }

  get error(): Error {
    return this._trace
  }

  get stack(): string | undefined {
    return this._trace.stack
  }
  get cleanStack(): string | undefined {
    if (this._trace?.stack === undefined) return undefined

    return this._trace.stack
      .split('\n')
      .filter((line: string) => !line.includes('node_modules'))
      .join('\n')
  }

  get isAborted(): boolean {
    return (
      this._abort === 'both' ||
      (this.isHttpContext === true && this._abort === 'http') ||
      (this.isHttpContext === false && this._abort === 'intern')
    )
  }

  get statusRange(): number {
    return Math.trunc(this._intels.status / 100) * 100
  }

  get debug(): any {
    return this._debug
  }
  get payload(): any {
    return this._payload
  }

  private constructor(intels?: Partial<ExceptIntels>, abort?: ExceptAbort, data?: OptionalData) {
    this._ctx = HttpContext.get()
    this._intels = {
      ...{ status: 418, code: 'IM_A_TEAPOT', critical: false },
      ...intels,
    }

    this._trace = new Error('Trace')
    this._abort = abort ?? 'both'

    this._debug = data?.debug
    this._payload = data?.payload
  }

  private _launch() {
    const logs: any = {
      intels: this.intels,
      aborted: this.isAborted,
    }
    if (this._debug !== undefined) logs.debug = this._debug

    if (this.isHttpContext) {
      this._ctx?.response.status(this._intels.status).send(this._intels)
      logs.url = this._ctx?.request?.completeUrl()
    }

    logs.stack = this.cleanStack

    if (this.intels.critical === true) logger.fatal(logs)
    else if (this.statusRange === 400) logger.warn(logs)
    else logger.error(logs)

    if (this.statusRange === 500 || this.intels.critical) {
      discordMessage.exceptError(logs)
    }

    if (this.isAborted) {
      if (this.isHttpContext === false) throw this._intels
      else this._ctx?.response.abort(this._intels, this._intels.status)
    }
  }

  static custom(): null
  static custom(intels?: Partial<ExceptIntels>, abort?: ExceptAbort): null
  static custom(intels?: Partial<ExceptIntels>, optionalData?: OptionalData): null
  static custom(
    intels?: Partial<ExceptIntels>,
    abort?: ExceptAbort,
    optionalData?: OptionalData
  ): null
  static custom(intels?: Partial<ExceptIntels>, param2?: any, param3?: any): null {
    let abort: ExceptAbort | undefined
    let optionalData: OptionalData | undefined

    if (param2 !== undefined) {
      if (typeof param2 === 'object') optionalData = param2
      else abort = param2
    }
    if (param3 !== undefined) optionalData = param3

    const except = new Except(intels, abort, optionalData)
    except._launch()

    return null
  }

  static imATeapot(): null
  static imATeapot(abort: ExceptAbort): null
  static imATeapot(optionalData: OptionalData): null
  static imATeapot(abort: ExceptAbort, optionalData: OptionalData): null
  static imATeapot(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 418,
        code: 'IM_A_TEAPOT',
        message: "I'm a teapot",
      },
      param1,
      param2
    )
  }

  static routeNotFound(): null
  static routeNotFound(abort: ExceptAbort): null
  static routeNotFound(optionalData: OptionalData): null
  static routeNotFound(abort: ExceptAbort, optionalData: OptionalData): null
  static routeNotFound(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 404,
        code: 'ROUTE_NOT_FOUND',
        message: 'No endpoint has been found at that url',
      },
      param1,
      param2
    )
  }

  static entryNotFound(): null
  static entryNotFound(abort: ExceptAbort): null
  static entryNotFound(optionalData: OptionalData): null
  static entryNotFound(abort: ExceptAbort, optionalData: OptionalData): null
  static entryNotFound(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 404,
        code: 'ENTRY_NOT_FOUND',
        message: 'The researched entry has not been found',
      },
      param1,
      param2
    )
  }

  static unauthorized(): null
  static unauthorized(abort: ExceptAbort): null
  static unauthorized(optionalData: OptionalData): null
  static unauthorized(abort: ExceptAbort, optionalData: OptionalData): null
  static unauthorized(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'You are not authorized to access this resource',
      },
      param1,
      param2
    )
  }

  static forbidden(): null
  static forbidden(abort: ExceptAbort): null
  static forbidden(optionalData: OptionalData): null
  static forbidden(abort: ExceptAbort, optionalData: OptionalData): null
  static forbidden(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 403,
        code: 'FORBIDDEN',
        message: 'You are not authorized to access this resource',
      },
      param1,
      param2
    )
  }

  static conflict(): null
  static conflict(abort: ExceptAbort): null
  static conflict(optionalData: OptionalData): null
  static conflict(abort: ExceptAbort, optionalData: OptionalData): null
  static conflict(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 409,
        code: 'CONFLICT',
        message: 'Conflict the current state of the resource',
      },
      param1,
      param2
    )
  }

  static unprocessableEntity(): null
  static unprocessableEntity(abort: ExceptAbort): null
  static unprocessableEntity(optionalData: OptionalData): null
  static unprocessableEntity(abort: ExceptAbort, optionalData: OptionalData): null
  static unprocessableEntity(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 422,
        code: 'UNPROCESSABLE_ENTITY',
        message: 'The request cannot be processed, please verify your body',
      },
      param1,
      param2
    )
  }

  static timeOut(): null
  static timeOut(abort: ExceptAbort): null
  static timeOut(optionalData: OptionalData): null
  static timeOut(abort: ExceptAbort, optionalData: OptionalData): null
  static timeOut(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 408,
        code: 'TIMEOUT',
        message: 'The request has timed out',
      },
      param1,
      param2
    )
  }

  static contentTooLarge(): null
  static contentTooLarge(abort: ExceptAbort): null
  static contentTooLarge(optionalData: OptionalData): null
  static contentTooLarge(abort: ExceptAbort, optionalData: OptionalData): null
  static contentTooLarge(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 413,
        code: 'CONTENT_TOO_LARGE',
        message: 'The request content is too large',
      },
      param1,
      param2
    )
  }

  static unsupportedMediaType(): null
  static unsupportedMediaType(abort: ExceptAbort): null
  static unsupportedMediaType(optionalData: OptionalData): null
  static unsupportedMediaType(abort: ExceptAbort, optionalData: OptionalData): null
  static unsupportedMediaType(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 415,
        code: 'UNSUPPORTED_MEDIA_TYPE',
        message: 'The request content media type is not supported',
      },
      param1,
      param2
    )
  }

  static expectationFailed(): null
  static expectationFailed(abort: ExceptAbort): null
  static expectationFailed(optionalData: OptionalData): null
  static expectationFailed(abort: ExceptAbort, optionalData: OptionalData): null
  static expectationFailed(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 417,
        code: 'EXPECTATION_FAILED',
        message: 'The expectation failed',
      },
      param1,
      param2
    )
  }

  static internalServerError(): null
  static internalServerError(abort: ExceptAbort): null
  static internalServerError(optionalData: OptionalData): null
  static internalServerError(abort: ExceptAbort, optionalData: OptionalData): null
  static internalServerError(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
      param1,
      param2
    )
  }

  static badGateway(): null
  static badGateway(abort: ExceptAbort): null
  static badGateway(optionalData: OptionalData): null
  static badGateway(abort: ExceptAbort, optionalData: OptionalData): null
  static badGateway(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 502,
        code: 'BAD_GATEWAY',
        message: 'Bad gateway',
      },
      param1,
      param2
    )
  }

  static serviceUnavailable(): null
  static serviceUnavailable(abort: ExceptAbort): null
  static serviceUnavailable(optionalData: OptionalData): null
  static serviceUnavailable(abort: ExceptAbort, optionalData: OptionalData): null
  static serviceUnavailable(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 503,
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service unavailable',
      },
      param1,
      param2
    )
  }

  static gatewayTimeout(): null
  static gatewayTimeout(abort: ExceptAbort): null
  static gatewayTimeout(optionalData: OptionalData): null
  static gatewayTimeout(abort: ExceptAbort, optionalData: OptionalData): null
  static gatewayTimeout(param1?: any, param2?: any): null {
    return Except.custom(
      {
        status: 504,
        code: 'GATEWAY_TIMEOUT',
        message: 'Gateway timeout',
      },
      param1,
      param2
    )
  }
}
