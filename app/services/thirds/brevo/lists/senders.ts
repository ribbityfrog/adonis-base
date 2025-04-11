import env from '#start/env'

export default {
  default: {
    email: env.get('BV_SENDER_EMAIL_DEFAULT') ?? 'noreply@preprod.tech',
    name: env.get('BV_SENDER_NAME_DEFAULT') ?? 'Mabel',
  },
  transactional: {
    email: 'noreply@preprod.tech',
    name: 'Mabel',
  },
} as const satisfies Record<string, { email: string; name: string }>
