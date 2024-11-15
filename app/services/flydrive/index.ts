import { Disk } from 'flydrive'
import { S3Driver } from 'flydrive/drivers/s3'
import storageConfig from '#config/storage'
import Except from '#utils/except'
import { SignedURLOptions } from 'flydrive/types'

export default class Flydrive {
  private _disk: Disk

  constructor() {
    this._disk = new Disk(new S3Driver(storageConfig))
  }

  async store(path: string, buffer: Buffer): Promise<boolean> {
    if ((await this.exists(path)) === true) {
      Except.conflict('none', { debug: { message: '[service] Flydrive - File already exists' } })
      return false
    }

    return await this.put(path, buffer)
  }

  async retrieve(path: string): Promise<Buffer> {
    if ((await this.exists(path)) === false) {
      Except.conflict('none', { debug: { message: "[service] Flydrive - File doesn't exists" } })
      return Buffer.from('')
    }

    return this.get(path)
  }

  async retrieveUrl(path: string): Promise<string> {
    if ((await this.exists(path)) === false) {
      Except.conflict('none', { debug: { message: "[service] Flydrive - File doesn't exist" } })
      return ''
    }

    return this.getUrl(path)
  }

  async retrieveSignedUrl(
    path: string,
    options: SignedURLOptions = { expiresIn: '2mins' }
  ): Promise<string> {
    if ((await this.exists(path)) === false) {
      Except.conflict('none', { debug: { message: "[service] Flydrive - File doesn't exist" } })
      return ''
    }

    return this.getSignedUrl(path, options)
  }

  async put(filename: string, content: string | Uint8Array): Promise<boolean> {
    let isPut = false

    await this._disk
      .put(filename, content)
      .then(() => (isPut = true))
      .catch((error) => {
        Except.serviceUnavailable('none', {
          debug: { message: '[service] Flydrive - Failed to put item', error },
        })
      })

    return isPut
  }

  async get(path: string): Promise<Buffer> {
    let isGot = false

    await this._disk
      .get(path)
      .then(() => (isGot = true))
      .catch((error) => {
        Except.serviceUnavailable('none', {
          debug: { message: '[service] Flydrive - Failed to get item', error },
        })
      })

    if (isGot === false) return Buffer.from('')

    return Buffer.from(await this._disk.getBytes(path))
  }

  async getUrl(path: string): Promise<string> {
    let unsignedUrl: string = ''

    await this._disk
      .getUrl(path)
      .then((url) => (unsignedUrl = url))
      .catch(() => {})

    return unsignedUrl
  }

  async getSignedUrl(
    path: string,
    options: SignedURLOptions = { expiresIn: '2mins' }
  ): Promise<string> {
    let signedUrl: string = ''

    await this._disk
      .getSignedUrl(path, options)
      .then((url) => (signedUrl = url))
      .catch(() => {})

    return signedUrl
  }

  async exists(path: string) {
    return await this._disk.exists(path)
  }

  async delete(path: string): Promise<void> {
    await this._disk
      .delete(path)
      .then()
      .catch((error) =>
        Except.serviceUnavailable('none', {
          debug: { message: '[service] Flydrive - Failed to delete item', error },
        })
      )
  }
}
