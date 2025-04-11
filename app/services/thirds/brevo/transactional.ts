import Except from '#utils/except'

import type { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

import sendersList from '#services/thirds/brevo/lists/senders'
import templatesList from '#services/thirds/brevo/lists/templates'

export default class Transactional {
  private _apiInstance: TransactionalEmailsApi

  get apiInstance(): TransactionalEmailsApi {
    return this._apiInstance
  }

  constructor(transactionalApiInstance: TransactionalEmailsApi) {
    this._apiInstance = transactionalApiInstance
  }

  init(apiKey: string, sdk: any) {
    this._apiInstance.setApiKey(sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey)
  }

  async sendTest(email: string) {
    return await this.send(templatesList.test, email, {
      PARAM: 'Params too',
    })
  }

  async sendAccountCreate(
    to: string,
    params: { MLINK: string },
    options: SendSmtpEmail = {}
  ): Promise<boolean> {
    return await this.send(templatesList.accountConnect, to, params, options)
  }

  async sendAccountConnect(
    to: string,
    params: { MLINK: string },
    options: SendSmtpEmail = {}
  ): Promise<boolean> {
    return await this.send(templatesList.accountCreate, to, params, options)
  }

  async sendAccountBanned(to: string) {
    return await this.send(templatesList.accountBanned, to)
  }

  async sendProfileUpdateEmail(to: string, params: { MLINK: string }, options: SendSmtpEmail = {}) {
    return await this.send(templatesList.profileUpdateEmail, to, params, options)
  }

  async send(
    templateId: number,
    to: string,
    params: Record<string, string> = {},
    transacEmail: SendSmtpEmail = {}
  ) {
    transacEmail.templateId = templateId

    if (!transacEmail.to) transacEmail.to = [{ email: to }]
    else transacEmail.to.unshift({ email: to })

    if (params && Object.keys(params).length > 0) transacEmail.params = params

    if (!transacEmail.sender)
      transacEmail.sender = sendersList?.transactional ?? sendersList.default

    let isSent = false

    await this._apiInstance
      .sendTransacEmail(transacEmail)
      .then(() => (isSent = true))
      .catch((error) =>
        Except.internalServerError('none', { debug: { message: "Couldn't send email", error } })
      )

    return isSent
  }
}
