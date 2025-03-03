import Except from '#utils/except'

import brevoSdk from '@getbrevo/brevo'
import type { ContactsApi } from '@getbrevo/brevo'

import contactsListsList from '#services/thirds/brevo/lists/contacts_lists'

export default class Contacts {
  private _apiInstance: ContactsApi

  get apiInstance(): ContactsApi {
    return this._apiInstance
  }

  constructor(contactsApiInstance: ContactsApi) {
    this._apiInstance = contactsApiInstance
  }

  init(apiKey: string, sdk: any) {
    this._apiInstance.setApiKey(sdk.ContactsApiApiKeys.apiKey, apiKey)
  }

  async addInTest(contact: Record<string, string> & { email: string }) {
    return await this.addContact([contactsListsList.test], contact)
  }

  async removeFromTest(emails: string | string[]) {
    const contactsEmails = Array.isArray(emails) ? emails : [emails]

    return await this.removeContacts(contactsListsList.test, contactsEmails)
  }

  async addContact(listIds: number[], contact: Record<string, string> & { email: string }) {
    let isAdded = false

    const { email, ...attributes } = contact

    await this._apiInstance
      .createContact({
        email,
        listIds,
        updateEnabled: true,
        attributes,
      })
      .then(() => (isAdded = true))
      .catch((error) =>
        Except.internalServerError('none', { debug: { message: "Couldn't add contact", error } })
      )

    return isAdded
  }

  async removeContacts(listId: number, emails: string[]) {
    let isRemoved = false

    const contacts = new brevoSdk.RemoveContactFromList()
    contacts.emails = emails

    await this._apiInstance
      .removeContactFromList(listId, contacts)
      .then(() => (isRemoved = true))
      .catch((error) =>
        Except.internalServerError('none', { debug: { message: "Couldn't remove contact", error } })
      )

    return isRemoved
  }
}
