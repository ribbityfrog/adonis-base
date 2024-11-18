import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import withDefaultFields from '#models/mixins/default_fields'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import type { OperationType } from '#models/accounts/types'

import User from '#models/accounts/user'
import type { UUID } from 'node:crypto'
import string from '@adonisjs/core/helpers/string'

export default class Operation extends compose(BaseModel, withDefaultFields) {
  static table = 'accounts.operations'

  @column()
  declare userId: UUID
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare operationType: OperationType

  @column()
  declare searchKey: string // cuid string

  @column()
  declare verificationKey: string // argon2 string

  static async getFromKeys(searchKey: string, operationType: OperationType) {
    return await Operation.query()
      .preload('user')
      .where('search_key', searchKey)
      .andWhere('operation_type', operationType)
      .first()
  }

  static async createSearchKey(): Promise<string | undefined> {
    let searchKey
    for (let tryKey = 0; tryKey < 5; tryKey++) {
      searchKey = string.random(8)

      if ((await Operation.findBy('searchKey', searchKey)) === null) break

      searchKey = undefined
    }
    return searchKey
  }
}
