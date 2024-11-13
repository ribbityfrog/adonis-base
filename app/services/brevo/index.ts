// Available endpoints : https://developers.brevo.com/docs/available-functions-in-api-clients
import env from '#start/env'
import brevoSdk, { TransactionalEmailsApi } from '@getbrevo/brevo'

export default class Brevo {
  private _sdk: any
  private _apiKey?: string
  private _Apitransactional?: TransactionalEmailsApi

  constructor() {
    this._sdk = brevoSdk
    this._apiKey = env.get('BV_API_KEY')
  }

  init() {
    this._Apitransactional = new this._sdk.TransactionalEmailsApi()
    if (this._apiKey)
      this._Apitransactional?.setApiKey(
        this._sdk.TransactionalEmailsApiApiKeys.apiKey,
        this._apiKey
      )
    else console.log('Brevo API key is missing. Please add it in .env file.')
  }

  async sendTransacEmail(templateId: number, email: {} = {}) {
    const transacEmail = { ...new this._sdk.SendSmtpEmail(), ...email }

    transacEmail.sender = {
      email: env.get('BV_SENDER_EMAIL_DEFAULT'),
      name: env.get('BV_SENDER_NAME_DEFAULT'),
    }

    if (transacEmail.to === undefined) transacEmail.to = [{ email: env.get('BV_RECEIVER_TEST') }]

    transacEmail.templateId = templateId

    return this._Apitransactional?.sendTransacEmail(transacEmail)
  }
}
