export const breeMessagetypes = ['failed_igniting_app', 'failed_accessing_database'] as const
export type BreeMessageType = (typeof breeMessagetypes)[number]

export type BreeMessage = {
  type: BreeMessageType
  data?: Record<string, string | number | boolean>
  issue?: any
}
