import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/accounts/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        email: 'a@a.aa',
      },
      {
        email: 'b@b.bb',
      },
      {
        email: 'c@c.cc',
      },
      {
        email: 'd@d.dd',
      },
      {
        email: 'e@e.ee',
      },
    ])
  }
}
