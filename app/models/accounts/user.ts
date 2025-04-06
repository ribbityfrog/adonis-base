import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { DateTime } from 'luxon'

import withDefaultFields from '#models/mixins/default_fields'

import Operation from '#models/accounts/operation'
import { OperationType } from '#models/accounts/types'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, withDefaultFields) {
  static table = 'accounts.users'
  currentAccessToken?: AccessToken

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare isVerified: boolean

  @column()
  declare isBanned: boolean

  @column()
  declare isAdmin: boolean

  @column()
  declare lastConnection: DateTime

  @hasMany(() => Operation)
  declare operations: HasMany<typeof Operation>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '32 days',
    prefix: 'oat_',
    table: 'accounts.connections',
    type: 'auth_token',
    tokenSecretLength: 44,
  })

  async createToken(verify: boolean = false): Promise<AccessToken> {
    const token = await User.accessTokens.create(this, [this.isAdmin ? 'admin' : 'user'])

    if (!this.isVerified && verify) this.isVerified = true

    this.lastConnection = DateTime.now()
    await this.save()

    return token
  }

  static async getWithOperations(email: string): Promise<User | null> {
    return await User.query().preload('operations').where('email', email).first()
  }

  async clearOperations(operationType?: OperationType): Promise<void> {
    const query = Operation.query().where('user_id', this.id)

    if (operationType !== undefined) query.andWhere('operation_type', operationType)

    await query.delete()
  }
}
