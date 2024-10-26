import type { Knex } from 'knex'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default (that: BaseSchema, table: Knex.CreateTableBuilder) => {
  table.uuid('id').primary().defaultTo(that.raw('gen_random_uuid()'))
  table.timestamp('created_at').notNullable()
  table.timestamp('updated_at').nullable()
}
