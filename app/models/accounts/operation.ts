import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import withDefaultFields from '#models/mixins/default_fields'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import type { OperationType } from '#models/accounts/types'

import User from '#models/accounts/user'
import type { UUID } from 'node:crypto'

export default class Operation extends compose(BaseModel, withDefaultFields) {
  static table = 'accounts.operations'

  @column()
  declare userId: UUID
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare operation: OperationType

  @column()
  declare searchKey: string // cuid string

  @column()
  declare verificationKey: string // argon2 string
}
