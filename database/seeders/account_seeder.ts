import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/accounts/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        email: 'catch@preprod.tech',
        password: '123soleil',
        isAdmin: true,
        isVerified: true,
      },
      {
        email: 'a@preprod.tech',
        password: '123soleil',
      },
      {
        email: 'b@preprod.tech',
        password: '123soleil',
        isVerified: true,
      },
      {
        email: 'c@preprod.tech',
        password: '123soleil',
        isAdmin: true,
        isVerified: true,
      },
    ])
  }
}
