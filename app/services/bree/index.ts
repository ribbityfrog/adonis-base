import env from '#start/env'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import BreeInstance from 'bree'
import logger from '@adonisjs/core/services/logger'

export default class Bree {
  private _instance: BreeInstance

  get instance(): BreeInstance {
    return this._instance
  }

  constructor() {
    this._instance = new BreeInstance({
      root: path.join(path.dirname(fileURLToPath(import.meta.url)), 'jobs'),

      defaultExtension: env.get('NODE_ENV', 'production') === 'production' ? 'js' : 'ts',

      jobs: [
        {
          name: 'job',
          interval: 'every 1 hour',
        },
      ],
    })
  }

  // prepare() {}

  async init() {
    await this._instance
      .start()
      .then(() => logger.info('[service] Bree has started properly'))
      .catch((error) => logger.error(`[service] Bree has failed to start: ${error}`))
  }
}
