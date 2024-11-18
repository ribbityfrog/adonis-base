export const operationTypes = ['connect'] as const
export type OperationType = (typeof operationTypes)[number]
