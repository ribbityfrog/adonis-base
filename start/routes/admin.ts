import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { userAdminUpdateSchema, userIdSchema } from '#schemas/accounts/user'

export default function () {
  const adminController = () => import('#controllers/admin/admin_controller')
  const adminUserController = () => import('#controllers/admin/users_controller')

  router
    .group(() => {
      router.get('check', [adminController, 'check'])

      router
        .group(() => {
          router.get('list', [adminUserController, 'list'])
          router
            .patch('update', [adminUserController, 'update'])
            .use(middleware.validateBody(userAdminUpdateSchema))
          router
            .delete('disconnect/:id', [adminUserController, 'disconnect'])
            .use(middleware.validateParams(userIdSchema))
        })
        .prefix('users')
    })
    .prefix('/admin')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.admin())
}
