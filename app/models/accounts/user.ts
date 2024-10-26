// import hash from '@adonisjs/core/services/hash'
// import { compose } from '@adonisjs/core/helpers'
import DefaultModel from '#models/base/default'
import { column } from '@adonisjs/lucid/orm'
// import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

// const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
//   uids: ['email'],
//   passwordColumnName: 'password',
// })

// export default class User extends compose(DefaultModel, AuthFinder) {
export default class User extends DefaultModel {
  static table = 'accounts.users'
  currentAccessToken?: AccessToken

  @column()
  declare email: string

  // @column({ serializeAs: null })
  // declare password: string

  @column()
  declare verified: boolean

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'accounts.connections',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
