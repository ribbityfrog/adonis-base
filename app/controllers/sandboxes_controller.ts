import type { HttpContext } from '@adonisjs/core/http'
import ProcessFile from '#utils/process_file'

export default class SandboxesController {
  async sand() {
    return 'Enter the sandbox'
  }

  async processFile({ request }: HttpContext) {
    const processedFiles = await ProcessFile.process(request)

    return processedFiles
  }
}
