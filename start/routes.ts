/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const sandboxesController = () => import('#controllers/sandboxes_controller')

router.get('/hello', [sandboxesController, 'hello'])
