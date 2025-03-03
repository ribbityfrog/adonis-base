import { LanguageCode } from '#utils/lang'

export default {
  test: {
    fr: 1,
    en: 1,
  },
  createAccount: {
    fr: 13,
    en: 13,
  },
  connect: {
    fr: 13,
    en: 13,
  },
  newEmail: {
    fr: 13,
    en: 13,
  },
} as const satisfies Record<string, Record<LanguageCode, number>>
