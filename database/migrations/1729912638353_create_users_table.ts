import { BaseSchema } from '@adonisjs/lucid/schema'
import { defaultFieldsMigration } from '#models/mixins/default_fields'

export default class extends BaseSchema {
  protected accountsSchema = 'accounts'
  protected usersTable = 'users'
  protected connectionsTable = 'connections'

  async up() {
    this.schema.createSchema(this.accountsSchema)

    this.schema.withSchema(this.accountsSchema).createTable(this.usersTable, (table) => {
      defaultFieldsMigration(this, table)

      table.string('email', 254).notNullable().unique()
      // table.string('password').notNullable()
      table.timestamp('last_connection')
    })

    this.schema.withSchema(this.accountsSchema).createTable(this.connectionsTable, (table) => {
      defaultFieldsMigration(this, table)

      table
        .uuid('tokenable_id')
        .notNullable()
        .references('id')
        .inTable(`${this.accountsSchema}.${this.usersTable}`)
        .onDelete('CASCADE')

      table.string('type').notNullable()
      table.string('name').nullable()
      table.string('hash').notNullable()
      table.text('abilities').notNullable()
      table.timestamp('last_used_at').nullable()
      table.timestamp('expires_at').nullable()
    })
  }

  async down() {
    this.schema.withSchema(this.accountsSchema).dropTable(this.connectionsTable)
    this.schema.withSchema(this.accountsSchema).dropTable(this.usersTable)
    this.schema.dropSchema(this.accountsSchema)
  }
}
