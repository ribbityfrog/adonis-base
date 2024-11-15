import type { HttpContext } from '@adonisjs/core/http'
import ProcessFile from '#utils/process_file'
import storage from '#services/storage'

export default class SandboxesController {
  async sand() {
    console.log(await storage.exists('placecat.png'))

    return 'done'
  }

  async processFile({ request }: HttpContext) {
    const processedFiles = await ProcessFile.process(request)

    console.log(await storage.store(processedFiles[0].basics.name, processedFiles[0].buffer))
    console.log(await storage.store(processedFiles[0].basics.name, processedFiles[0].buffer))

    return 'done'
  }
}
