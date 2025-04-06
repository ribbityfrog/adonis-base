export const operationTypes = ['connect', 'update-email'] as const
export type OperationType = (typeof operationTypes)[number]
