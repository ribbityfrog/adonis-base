import type { HttpContext } from '@adonisjs/core/http'

export default class ProfilesController {
  async get() {}

  async updatePassword() {}

  async updateEmail() {}

  async delete({ auth }: HttpContext) {
    await auth.user?.delete()
  }
}

//   async newEmail({ request }: HttpContext) {
//     const operationKeys = request.body() as OperationKeys

//     const operation = await Operation.useOrFail(operationKeys, 'updateEmail')

//     operation.user.email = operation.data.email
//     await operation.user.save()
//     await operation.delete()
// }
