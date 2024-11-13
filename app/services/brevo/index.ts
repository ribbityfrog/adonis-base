// Available endpoints : https://developers.brevo.com/docs/available-functions-in-api-clients
import env from '#start/env'
import Except from '#utils/except'
import logger from '@adonisjs/core/services/logger'
import brevoSdk, { TransactionalEmailsApi, AccountApi } from '@getbrevo/brevo'

export default class Brevo {
  private _instance: any
  private _apiKey: string
  private _Apitransactional: TransactionalEmailsApi
  private _ready: boolean = false

  get isReady(): boolean {
    return this._ready
  }

  get instanceTransac(): TransactionalEmailsApi {
    return this._Apitransactional
  }

  constructor() {
    this._instance = brevoSdk
    this._apiKey = env.get('BV_API_KEY')

    this._Apitransactional = new this._instance.TransactionalEmailsApi()
  }

  async init() {
    if (!this._Apitransactional) {
      Except.serviceUnavailable('intern', {
        debug: '[service] Brevo - TransactionalEmailsApi could not be instantiated',
      })
      return
    }

    this._Apitransactional.setApiKey(
      this._instance.TransactionalEmailsApiApiKeys.apiKey,
      this._apiKey
    )

    await this.checkAccount()
    this._ready = true
  }

  private async checkAccount() {
    const accountApi: AccountApi = new this._instance.AccountApi()

    accountApi.setApiKey(this._instance.AccountApiApiKeys.apiKey, this._apiKey)
    await accountApi
      .getAccount()
      .then((resp) =>
        logger.info(`[service] Brevo - Account reached, company: ${resp.body?.companyName}`)
      )
      .catch((error) =>
        Except.serviceUnavailable('intern', {
          debug: {
            message:
              '[service] Brevo - AccountApi cannot be reached, assuming TransactionalApi either if apiKey error',
            body: error.body,
            statusCode: error.statusCode,
          },
        })
      )
  }

  async sendTransacEmail(templateId: number, email: {} = {}) {
    const transacEmail = { ...new this._instance.SendSmtpEmail(), ...email }

    transacEmail.sender = {
      email: env.get('BV_SENDER_EMAIL_DEFAULT'),
      name: env.get('BV_SENDER_NAME_DEFAULT'),
    }

    if (transacEmail.to === undefined) transacEmail.to = [{ email: env.get('BV_RECEIVER_TEST') }]

    transacEmail.templateId = templateId

    return this._Apitransactional.sendTransacEmail(transacEmail)
  }
}
