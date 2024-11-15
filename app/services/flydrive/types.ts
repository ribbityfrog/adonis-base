import type { UUID } from 'node:crypto'

import { BasicFile } from '#utils/process_file/types'

type StoredFile = {
  uuid: UUID
  basics: BasicFile
}

export type { StoredFile as default }
