import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

import { OperationType } from '#schemas/accounts/types'

import operationKeysSchema from '#schemas/accounts/operation'
import { userCredentialsSchema, userEmailSchema, userPasswordSchema } from '#schemas/accounts/user'

const accountsRequestsController = () => import('#controllers/accounts/requests_controller')
const accountsConnectionsController = () => import('#controllers/accounts/connections_controller')
const accountsProfilesController = () => import('#controllers/accounts/profiles_controller')
const accountsOperationsController = () => import('#controllers/accounts/operations_controller')

export default function () {
  router
    .group(() => {
      router
        .group(() => {
          router.delete('logout', [accountsConnectionsController, 'logout'])
        })
        .use(middleware.auth({ guards: ['api'] }))
        .prefix('connection')

      router
        .group(() => {
          router.get('get', [accountsProfilesController, 'get'])

          // router.post('update', [accountsProfilesController, 'update'])
          router
            .patch('update-password', [accountsProfilesController, 'updatePassword'])
            .use(middleware.validateBody(userPasswordSchema))
          router
            .post('update-email', [accountsProfilesController, 'updateEmail'])
            .use(middleware.validateBody(userEmailSchema))

          router.delete('delete', [accountsProfilesController, 'delete'])
        })
        .use(middleware.auth({ guards: ['api'] }))
        .prefix('profile')

      router
        .group(() => {
          router.post('connect' satisfies OperationType, [accountsOperationsController, 'connect'])
          router.post('update-email' satisfies OperationType, [
            accountsOperationsController,
            'updateEmail',
          ])
        })
        .prefix('operation')
        .use(middleware.validateBody(operationKeysSchema))

      router
        .group(() => {
          router
            .post('create', [accountsRequestsController, 'create'])
            .use(middleware.validateBody(userCredentialsSchema))

          router
            .post('login', [accountsRequestsController, 'login'])
            .use(middleware.validateBody(userCredentialsSchema))

          router
            .post('login-passwordless', [accountsRequestsController, 'loginPasswordless'])
            .use(middleware.validateBody(userEmailSchema))
        })
        .prefix('request')
    })
    .prefix('/accounts')
}
