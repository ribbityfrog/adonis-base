type BasicFile = {
  title: string
  name: string
  type: string
  subtype: string
  ext: string
}

export type ProcessedFile = {
  basics: BasicFile
  path?: string
  size: number
  buffer: Buffer
}
