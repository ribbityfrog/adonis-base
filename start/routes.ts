/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', () => 'Hello :)')
router.get('/favicon.ico', () => 'Not a website ^^')

const sandboxesController = () => import('#controllers/sandboxes_controller')

router.get('/sand', [sandboxesController, 'sand'])

const usersController = () => import('#controllers/accounts/users_controller')
const connectionsController = () => import('#controllers/accounts/connections_controller')

// Users
router
  .group(() => {
    router.get('list', [usersController, 'list'])
    router.get('connections', [usersController, 'connections'])
  })
  .prefix('/users')

// Connections
router
  .group(() => {
    router.get('login', [connectionsController, 'login'])
  })
  .prefix('/connections')
