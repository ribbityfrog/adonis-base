import { DateTime } from 'luxon'

import Operation from '#models/accounts/operation'
import discordMessage from '#utils/discord_message'
import User from '#models/accounts/user'

export default async function () {
  const deletedOperations = await Operation.query()
    .where('expire_at', '<', DateTime.now().toSQL())
    .delete()

  if (deletedOperations?.[0] > 0)
    await discordMessage.custom(
      `[Bree_expiration] Deleted ${deletedOperations[0]} expired operations`
    )

  const deletedUsers = await User.query()
    .whereNull('last_connection')
    .andWhere('created_at', '<', DateTime.now().minus({ weeks: 1 }).toSQL())
    .delete()

  if (deletedUsers?.[0] > 0)
    await discordMessage.custom(`[Bree_expiration] Deleted ${deletedUsers[0]} expired users`)
}
