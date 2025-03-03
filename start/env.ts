/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  /*
  |----------------------------------------------------------
  | Variables for configuring node and HTTP server
  |----------------------------------------------------------
  */
  HOST: Env.schema.string({ format: 'host' }),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  CORS: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring magic links
  |----------------------------------------------------------
  */
  FRONT_ORIGIN: Env.schema.string(),
  MAGIC_CONNECT: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  POSTGRESQL_ADDON_DB: Env.schema.string(),
  POSTGRESQL_ADDON_HOST: Env.schema.string({ format: 'host' }),
  POSTGRESQL_ADDON_USER: Env.schema.string(),
  POSTGRESQL_ADDON_PASSWORD: Env.schema.string.optional(),
  POSTGRESQL_ADDON_PORT: Env.schema.number(),

  /*
  |----------------------------------------------------------
  | Variables for configuring mail service
  |----------------------------------------------------------
  */
  BV_API_KEY: Env.schema.string.optional(),
  BV_SENDER_EMAIL_DEFAULT: Env.schema.string.optional({ format: 'email' }),
  BV_SENDER_NAME_DEFAULT: Env.schema.string.optional(),

  /*
  |----------------------------------------------------------
  | Variables for configuring S3 storage service
  |----------------------------------------------------------
  */
  S3_ACCESS_KEY_ID: Env.schema.string.optional(),
  S3_SECRET_ACCESS_KEY: Env.schema.string.optional(),
  S3_REGION: Env.schema.string.optional(),
  S3_BUCKET: Env.schema.string.optional(),
  S3_ENDPOINT: Env.schema.string.optional(),
  S3_ACL: Env.schema.boolean.optional(),
  S3_VISIBILITY: Env.schema.enum.optional(['public', 'private'] as const),
})
