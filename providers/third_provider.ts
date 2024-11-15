import type { ApplicationService } from '@adonisjs/core/types'
import Brevo from '#services/brevo/index'
import Bree from '#services/bree/index'
import Flydrive from '#services/flydrive/index'

export default class ThirdProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(Brevo, () => new Brevo())
    this.app.container.singleton(Bree, () => new Bree())
    this.app.container.singleton(Flydrive, () => new Flydrive())
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {
    const mailer = await this.app.container.make(Brevo)
    await mailer
      .init()
      .then()
      .catch(() => {})

    const scheduler = await this.app.container.make(Bree)
    await scheduler
      .init()
      .then()
      .catch(() => {})

    const storage = await this.app.container.make(Flydrive)
    await storage.checkInit()
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
