import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import withDefaultFields from '#models/mixins/default_fields'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import type { OperationType } from '#models/accounts/types'

import User from '#models/accounts/user'
import type { UUID } from 'node:crypto'

import string from '@adonisjs/core/helpers/string'
import { cuid } from '@adonisjs/core/helpers'
import hash from '@adonisjs/core/services/hash'
import { OperationKeys } from '#schemas/accounts/operation'
import Except from '#utils/except'
import { DateTime } from 'luxon'

export default class Operation extends compose(BaseModel, withDefaultFields) {
  static table = 'accounts.operations'

  @column()
  declare userId: UUID

  @column()
  declare operationType: OperationType

  @column()
  declare searchKey: string // cuid string

  @column()
  declare verificationKey: string // argon2 string

  @column.dateTime()
  declare expireAt: DateTime

  @column({
    prepare: (value: any) => value ?? {},
  })
  declare data: any

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  static async getFromKeys(searchKey: string, operationType: OperationType) {
    return await Operation.query()
      .preload('user')
      .where('search_key', searchKey)
      .andWhere('operation_type', operationType)
      .first()
  }

  static async useOrFail(keys: OperationKeys, operationType: OperationType): Promise<Operation> {
    const operation = await Operation.getFromKeys(keys.searchKey, operationType)

    if (operation === null) Except.forbidden()

    const checkHash = await hash.verify(operation!.verificationKey, keys.verificationKey)
    if (checkHash === false) {
      await operation!.delete()
      Except.forbidden()
    }

    if (operation!.expireAt <= DateTime.now()) {
      await operation!.delete()
      Except.forbidden()
    }

    return operation as Operation
  }

  static async createSearchKey(): Promise<string> {
    let searchKey
    for (let tryKey = 0; tryKey < 5; tryKey++) {
      searchKey = cuid()

      if ((await Operation.findBy('searchKey', searchKey)) === null) break

      searchKey = undefined
    }

    if (searchKey === undefined)
      throw Except.internalServerError({ debug: 'Failed to create operation' })

    return searchKey
  }

  static async createForUser(
    user: User,
    operationType: OperationType,
    data: any = null,
    expireInMinutes: number = 15,
    clearPreviousEntries: boolean = true
  ): Promise<OperationKeys> {
    if (clearPreviousEntries) await user.clearOperations(operationType)

    const searchKey = await Operation.createSearchKey()
    const verificationKey = string.random(24)

    await user.related('operations').create({
      operationType,
      searchKey,
      verificationKey: await hash.make(verificationKey),
      data,
      expireAt: DateTime.now().plus({ minutes: expireInMinutes }),
    })

    return { searchKey, verificationKey }
  }
}
