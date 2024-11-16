export const operationTypes = ['connection'] as const
export type OperationType = (typeof operationTypes)[number]
