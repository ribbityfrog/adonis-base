import Except from '#utils/except'

import type { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

import sendersList from '#services/thirds/brevo/lists/senders'
import templatesList from '#services/thirds/brevo/lists/templates'
import { LanguageCode } from '#utils/lang'

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

  async sendTest(email: string, lang: LanguageCode = 'fr') {
    return await this.send(templatesList.test[lang], email, {
      PARAM: 'Params too',
    })
  }

  async sendCreateAccount(
    to: string,
    lang: LanguageCode,
    params: { MLINK: string },
    options: SendSmtpEmail = {}
  ): Promise<boolean> {
    return await this.send(templatesList.createAccount[lang], to, params, options)
  }

  async sendConnect(
    to: string,
    lang: LanguageCode,
    params: { MLINK: string },
    options: SendSmtpEmail = {}
  ): Promise<boolean> {
    return await this.send(templatesList.connect[lang], to, params, options)
  }

  // async sendNewEmail(to: string, params: { MLINK: string }, options: SendSmtpEmail = {}) {
  //   return await this.sendTransacEmail(savedTemplates.newEmail, to, params, options)
  // }

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

    if (!transacEmail.sender) transacEmail.sender = sendersList.default

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
