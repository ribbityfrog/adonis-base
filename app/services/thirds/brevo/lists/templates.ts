export default {
  test: 1,

  accountCreate: 13,
  accountConnect: 13,
  accountBanned: 1,
  profileUpdateEmail: 13,
} as const satisfies Record<string, number>
