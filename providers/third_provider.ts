import type { ApplicationService } from '@adonisjs/core/types'
import Brevo from '#services/brevo/index'
import Bree from '#services/bree/index'

export default class ThirdProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(Brevo, () => new Brevo())
    this.app.container.singleton(Bree, () => new Bree())
  }

  /**
   * The container bindings have booted
   */
  async boot() {
    await this.app.container.make(Bree)
    // scheduler.prepare()
  }

  /**
   * The application has been booted
   */
  async start() {
    const mailer = await this.app.container.make(Brevo)
    mailer.init()

    const scheduler = await this.app.container.make(Bree)
    await scheduler.init()
  }

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
