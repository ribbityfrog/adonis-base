import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/accounts/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        email: 'a@a.a',
      },
      {
        email: 'b@b.b',
      },
      {
        email: 'c@c.c',
      },
      {
        email: 'd@d.d',
      },
      {
        email: 'e@e.e',
      },
    ])
  }
}
