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

router.get('/mars', [sandboxesController, 'mars'])
router.get('/inaric', [sandboxesController, 'inaric'])
router.get('/tesseract', [sandboxesController, 'tesseract'])
