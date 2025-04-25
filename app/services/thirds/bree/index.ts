import env from '#start/env'
import BreeInstance from 'bree'
import Except from '#utils/except'
import logger from '@adonisjs/core/services/logger'
import app from '@adonisjs/core/services/app'
import discordMessage from '#utils/discord_message'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'jobs')
const extension = env.get('NODE_ENV', 'production') === 'production' ? 'js' : 'ts'
const resolvePath = (job: string) => `${root}/${job}.${extension}`

function setWorker(data: Record<string, string | number | boolean>) {
  return {
    workerData: {
      appRootString: app.appRoot.href,
      ...data,
    },
  }
}

export default class Bree {
  private _instance: BreeInstance
  private _isReady: boolean = false
  private _errorCounter: number = 0

  get instance(): BreeInstance {
    return this._instance
  }

  get isReady(): boolean {
    return this._isReady
  }

  constructor() {
    this._instance = new BreeInstance({
      root,

      defaultExtension: extension,
      logger: env.get('NODE_ENV', 'production') === 'production' ? false : console,

      // worker: {
      //   workerData: {
      //     appRootString: app.appRoot.href,
      //   },
      // },

      jobs: [
        {
          name: 'expiration',
          path: resolvePath('app'),
          worker: setWorker({ job: 'expiration' }),
          timeout: '5 seconds',
          interval: '1 day',
        },
        // {
        //   name: 'steam_list',
        //   timeout: '5 minutes',
        // },
        // {
        //   name: 'steam_enrich',
        //   timeout: '4 minutes',
        // },
      ],

      workerMessageHandler: (worker) => {
        if (worker.message === 'done') return
        logger.info(`[Bree] Received ${worker.message.type} from ${worker.name}`)
        this._instance.emit(worker.message.type, worker)
      },

      errorHandler: (error) => {
        this._errorCounter++
        logger.error(`[Bree] Error ${this._errorCounter} : ${error.message}`)
        if (this._errorCounter <= 3)
          discordMessage.custom(
            `[Bree] Error ${this._errorCounter} : ${error.message}
            Stack: ${error.stack}
            ${this._errorCounter === 3 ? 'Printing error stopped to avoid spam' : ''}`
          )
      },
    })
  }

  async start() {
    const schedule = env.get('SCHEDULER', false)

    if (schedule)
      await this._instance
        .start()
        .then(() => {
          this._initEvents()
          logger.info('[service] Bree - Started properly')
          this._isReady = true
        })
        .catch((error) =>
          Except.serviceUnavailable('none', {
            debug: { message: `[service] Bree - Failed to start : ${error.message}`, error },
          })
        )
    else logger.warn('[service] Bree not started, SCHEDULER env is false or undefined')
  }

  private _initEvents() {
    if (env.get('NODE_ENV') === 'development') {
      this._instance.on('worker created', async (name) =>
        logger.info(`[Bree] Worker "${name}" started`)
      )

      this._instance.on('worker deleted', async (name) => {
        logger.info(`[Bree] Worker "${name}" stopped`)
      })
    }

    this._instance.on('failed_accessing_database', async (worker) => {
      console.log(worker?.message)
      const message =
        `[Bree] Failed accessing database for ${worker.name} app ${worker?.message?.issue?.id ?? 'unknown'}:` +
        `\n${worker?.message?.issue?.message ? worker?.message?.issue?.message : (worker?.message?.issue ?? 'Error unkmown')}`

      logger.error(message)
      discordMessage.custom(message)
    })
  }
}
