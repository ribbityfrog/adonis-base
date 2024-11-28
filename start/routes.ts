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

router.get('/sand', [sandboxesController, 'sand'])
router.get('/sandGuarded', [sandboxesController, 'sand']).use(middleware.auth({ guards: ['api'] }))
router
  .get('/sandAdmin', [sandboxesController, 'sand'])
  .use(middleware.auth({ guards: ['api'] }))
  .use(middleware.admin())

const accountsUsersController = () => import('#controllers/accounts/users_controller')
const accountsConnectionsController = () => import('#controllers/accounts/connections_controller')
const accountsOperationsController = () => import('#controllers/accounts/operations_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('create', [accountsUsersController, 'create'])
        router.post('login', [accountsOperationsController, 'login'])
      })
      .use(middleware.validateBody(userSchema.pick({ email: true })))
      .prefix('request')

    router
      .group(() => {
        router.post('connect', [accountsOperationsController, 'connect'])
      })
      .use(middleware.validateBody(operationKeysSchema))
      .prefix('operation')

    router
      .group(() => {
        router.delete('deleteSelf', [accountsUsersController, 'deleteSelf'])
      })
      .use(middleware.auth({ guards: ['api'] }))
  })
  .prefix('/accounts')

router
  .group(() => {
    router.get('listSelf', [accountsConnectionsController, 'listSelf'])
    router.get('list', [accountsConnectionsController, 'list']).use(middleware.admin())
    router.delete('logout', [accountsConnectionsController, 'logout'])
  })
  .prefix('/connections')
  .use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.get('me', [accountsUsersController, 'me'])
    router.get('list', [accountsUsersController, 'list']).use(middleware.admin())
  })
  .prefix('/users')
  .use(middleware.auth({ guards: ['api'] }))

// Admin
router
  // Users
  .group(() => {
    router
      .group(() => {
        router.get('list', [accountsUsersController, 'list'])
      })
      .prefix('users')
  })
  .prefix('/admin')
  .use(middleware.auth({ guards: ['api'] }))
  .use(middleware.admin())
