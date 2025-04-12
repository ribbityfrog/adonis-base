import { isMainThread, MessagePort, parentPort } from 'node:worker_threads'
import type { BreeMessage } from '#services/thirds/bree/types'
import app from '@adonisjs/core/services/app'

class BreeEmit {
  #emitter: MessagePort | null = parentPort

  constructor() {
    if (this.#emitter === null) console.warn('No parentPort found')
    if (isMainThread)
      console.warn('[BreeEmit] is most likely being used in the main thread, which is not expected')
  }

  async failedIgnitingApp(stopExecution: boolean = false) {
    this.custom({ type: 'failed_igniting_app' }, stopExecution, true)
  }

  async failedAccessingDatabase(issue?: any, stopExecution: boolean = false) {
    this.custom({ type: 'failed_accessing_database', issue }, stopExecution, true)
  }

  async custom(breeMessage: BreeMessage, stopExecution: boolean = false, exitOne: boolean = false) {
    if (isMainThread) return

    this.#emitter?.postMessage(breeMessage)

    if (stopExecution) {
      if (app.isReady) await app.terminate()
      process.exit(exitOne ? 1 : 0)
    }
  }
}

const breeEmit = new BreeEmit()
export { breeEmit as default }
