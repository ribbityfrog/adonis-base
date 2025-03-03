// Available endpoints : https://developers.brevo.com/docs/available-functions-in-api-clients
import env from '#start/env'
import Except from '#utils/except'
import logger from '@adonisjs/core/services/logger'
import brevoSdk from '@getbrevo/brevo'
import type { AccountApi } from '@getbrevo/brevo'

import Transactional from '#services/thirds/brevo/transactional'
import Contacts from '#services/thirds/brevo/contacts'

export default class Brevo {
  private _instance: any
  private _apiKey: string | undefined
  private _isInitialized: boolean = false

  private _transactional: Transactional | undefined
  private _contacts: Contacts | undefined

  get isInitialized(): boolean {
    return this._isInitialized
  }

  get transactional(): Transactional | undefined {
    return this._transactional
  }

  get contacts(): Contacts | undefined {
    return this._contacts
  }

  constructor() {
    this._instance = brevoSdk
    this._apiKey = env.get('BV_API_KEY')

    if (this._apiKey !== undefined) {
      this._transactional = new Transactional(new this._instance.TransactionalEmailsApi())
      this._contacts = new Contacts(new this._instance.ContactsApi())
    }
  }

  async init() {
    if (this._apiKey === undefined) {
      logger.warn(`[service] Brevo - Missing API Key`)
      return
    }

    this._transactional!.init(this._apiKey, this._instance)
    this._contacts!.init(this._apiKey, this._instance)

    this._isInitialized = true
    await this.checkAccount()
  }

  private async checkAccount() {
    const accountApi: AccountApi = new this._instance.AccountApi()

    if (!this._isInitialized) return

    accountApi.setApiKey(this._instance.AccountApiApiKeys.apiKey, this._apiKey!)
    await accountApi
      .getAccount()
      .then((resp) =>
        logger.info(`[service] Brevo - Account reached, company: ${resp.body?.companyName}`)
      )
      .catch((error) =>
        Except.serviceUnavailable('none', {
          debug: {
            message:
              '[service] Brevo - AccountApi cannot be reached, assuming TransactionalApi either if apiKey error',
            body: error.body,
            statusCode: error.statusCode,
          },
        })
      )
  }
}
