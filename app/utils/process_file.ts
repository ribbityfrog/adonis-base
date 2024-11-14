import { Request } from '@adonisjs/core/http'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import type { ProcessedFile } from '#utils/process_file/types'

export default class ProcessFile {
  static async consume(request: Request): Promise<Record<string, MultipartFile | MultipartFile[]>> {
    request.multipart.onFile('*', {}, async (part, reporter) => {
      const buffer: { parts: Buffer[]; totalSize: number; partsNumber: number } = {
        parts: [],
        totalSize: 0,
        partsNumber: 0,
      }

      part.on('data', reporter)
      part.on('data', (chunk) => {
        buffer.partsNumber++
        buffer.totalSize += chunk.length
        buffer.parts.push(Buffer.from(chunk))
      })
      part.on('end', () => {})

      return { buffer }
    })

    await request.multipart.process()
    return request.allFiles()
  }

  private static processMultipartFile(file: MultipartFile): ProcessedFile {
    return {
      basics: {
        title: file.fieldName,
        name: file.clientName,
        ext: file.extname ?? '',
        type: file.type ?? '',
        subtype: file.subtype ?? '',
      },
      path: file.filePath,
      size: file.meta.buffer.totalSize,
      buffer: Buffer.concat(
        file.meta.buffer.parts.length > 0 ? file.meta.buffer.parts : [Buffer.from('')]
      ),
    }
  }

  private static processRecordOfMultipartFiles(
    files: Record<string, MultipartFile | MultipartFile[]>
  ): ProcessedFile[] {
    const processedFiles: ProcessedFile[] = []

    Object.values(files).forEach((multipartFile) => {
      if (Array.isArray(multipartFile))
        multipartFile.forEach((file) => processedFiles.push(ProcessFile.processMultipartFile(file)))
      else processedFiles.push(ProcessFile.processMultipartFile(multipartFile))
    })

    return processedFiles
  }

  static async process(request: Request): Promise<ProcessedFile[]> {
    const consumedFiles = await ProcessFile.consume(request)
    const processedFiles = ProcessFile.processRecordOfMultipartFiles(consumedFiles)

    return processedFiles
  }
}
