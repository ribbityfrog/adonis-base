import { Disk } from 'flydrive'
import { S3Driver } from 'flydrive/drivers/s3'
import storageConfig from '#config/storage'
import type StoredFile from '#services/flydrive/types'
import type { ProcessedFile } from '#utils/process_file/types'
import { randomUUID, UUID } from 'node:crypto'
import Except from '#utils/except'

export default class Flydrive {
  private _disk: Disk

  constructor() {
    this._disk = new Disk(new S3Driver(storageConfig))
  }

  async store(file: ProcessedFile): Promise<StoredFile | null> {
    const storedFile = {
      uuid: randomUUID(),
      basics: file.basics,
    }

    const isPut = await this.put(file.basics.name, file.buffer)

    if (isPut === false) return null

    return storedFile
  }

  // async storeArray(files: ProcessedFile[]): Promise<[StoredFile[], ProcessedFile[]]> {
  //   const storedFiles: StoredFile[] = []
  //   const failedFiles: ProcessedFile[] = []

  //   for (const file of files) {
  //     const tryStore = await this.store(file)

  //     if (tryStore === null) failedFiles.push(file)
  //     else storedFiles.push(tryStore)
  //   }

  //   return [storedFiles, failedFiles]
  // }

  // async retrieve(file: StoredFile): Promise<string | null> {
  //   // const fileId = typeof file === 'string' ? file : file.uuid

  //   return this.getSignedUrl(file.basics.name)
  // }
  async retrieve(file: string): Promise<string | null> {
    // const fileId = typeof file === 'string' ? file : file.uuid

    return this.getSignedUrl(file)
  }

  // async retrieveArray(
  //   files: StoredFile[] | UUID[],
  //   inquiryId: UUID,
  //   isSample: boolean
  // ): Promise<[string[], StoredFile[] | UUID[]]> {
  //   const paths: string[] = []
  //   const failedFiles: StoredFile[] = []
  //   const failedFilesByUUID: UUID[] = []

  //   const isUuid = typeof files[0] === 'string'

  //   for (const file of files) {
  //     const path = await this.retrieve(file, inquiryId, isSample)

  //     if (path !== null) paths.push(path)
  //     else {
  //       if (typeof file === 'string') failedFilesByUUID.push(file)
  //       else failedFiles.push(file)
  //     }
  //   }

  //   return [paths, isUuid ? failedFilesByUUID : failedFiles]
  // }

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

  // async getString(filename: string): Promise<string> {
  //     return this._disk.get(filename);
  // }

  // async getInt8ArrayBuffer(filename: string): Promise<Uint8Array> {
  //   return new Uint8Array(await this._disk.getArrayBuffer(filename))
  // }

  // async getArrayBuffer(filename: string): Promise<ArrayBuffer> {
  //   return await this._disk.getArrayBuffer(filename)
  // }

  // async getBuffer(filename: string): Promise<Buffer> {
  //   return Buffer.from(await this._disk.getArrayBuffer(filename))
  // }

  // async getUrl(filename: string): Promise<string> {
  //     return this._disk.getUrl(filename);
  // }

  async getSignedUrl(filename: string): Promise<string | null> {
    let signedUrl: string | null = null

    await this._disk
      .getSignedUrl(filename, {
        expiresIn: '2mins',
        // contentType: 'image/jpg',
        // contentDisposition: 'attachment',
      })
      .then((path) => (signedUrl = path))
      .catch((_) => {})

    return signedUrl
  }

  async delete(file: StoredFile): Promise<boolean> {
    let tryDelete = false

    // await this._disk
    //   .delete(this.buildPath(inquiryId, isSample, file))
    //   .then((_) => (tryDelete = true))
    //   .catch((_) => {})

    return tryDelete
  }
}
