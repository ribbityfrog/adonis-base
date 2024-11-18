import db from '@adonisjs/lucid/services/db'

export default class ConnectionsController {
  async list() {
    return await db.from('accounts.connections').select('*')
  }
}
