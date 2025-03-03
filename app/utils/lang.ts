import type { Request } from '@adonisjs/core/http'

export const languagesAvailable = ['fr', 'en'] as const
export type LanguageCode = (typeof languagesAvailable)[number]

export function getLang(request: Request): LanguageCode {
  const lang = request.header('Accept-Language')

  if (lang?.startsWith('fr')) return 'fr'
  else if (lang?.startsWith('en')) return 'en'

  return 'fr'
}
