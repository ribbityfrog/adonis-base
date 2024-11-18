/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

import userSchema from '#schemas/accounts/user'
import operationKeysSchema from '#schemas/accounts/operation'

router.get('/', () => 'Hello :)')
router.get('/favicon.ico', () => 'Not a website ^^')

const sandboxesController = () => import('#controllers/sandboxes_controller')

router.get('/sand', [sandboxesController, 'sand']).use(middleware.auth({ guards: ['api'] }))

const accountsUsersController = () => import('#controllers/accounts/users_controller')
const accountsConnectionsController = () => import('#controllers/accounts/connections_controller')
const accountsOperationsController = () => import('#controllers/accounts/operations_controller')

router
  .group(() => {
    router
      .group(() => {
        router
          .group(() => {
            router.post('/login', [accountsOperationsController, 'requestLogin'])
          })
          .use(middleware.validateBody(userSchema.pick({ email: true })))
          .prefix('request')
        router
          .group(() => {
            router.post('/login', [accountsOperationsController, 'login'])
          })
          .use(middleware.validateBody(operationKeysSchema))
      })
      .prefix('operations')
  })
  .prefix('/accounts')
// Operations with magic links

// Admin
router
  // Users
  .group(() => {
    router
      .group(() => {
        router.get('list', [accountsUsersController, 'list'])
      })
      .prefix('users')

    // Connections
    router
      .group(() => {
        router.get('list', [accountsConnectionsController, 'list'])
      })
      .prefix('connections')
  })
  .prefix('/admin')
