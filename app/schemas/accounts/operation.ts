import { z } from 'zod'

const operationKeysSchema = z
  .object({
    searchKey: z.string(),
    verificationKey: z.string(),
  })
  .strict()
export default operationKeysSchema

export type OperationKeys = z.infer<typeof operationKeysSchema>
