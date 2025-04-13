import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

export default function () {
  const adminController = () => import('#controllers/admin/admin_controller')
  const adminUserController = () => import('#controllers/admin/users_controller')

  router
    .group(() => {
      router.get('check', [adminController, 'check'])

      router
        .group(() => {
          router.get('list', [adminUserController, 'list'])
        })
        .prefix('users')
    })
    .prefix('/admin')
    .use(middleware.auth({ guards: ['api'] }))
    .use(middleware.admin())
}
