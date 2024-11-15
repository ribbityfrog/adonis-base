import type { HttpContext } from '@adonisjs/core/http'
import ProcessFile from '#utils/process_file'
import storage from '#services/storage'

export default class SandboxesController {
  async sand() {
    console.log(await storage.retrieve('placecat.png'))

    return 'Enter the sandbox'
  }

  async processFile({ request }: HttpContext) {
    const processedFiles = await ProcessFile.process(request)

    const storedFile = await storage.store(processedFiles[0])

    return storedFile
  }
}
