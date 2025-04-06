import { z } from 'zod'

const email = z.string().email('Email mandatory')
const password = z
  .string()
  .min(8, '8 characters minimum')
  .max(31, '31 characters maximum')
  .refine((pass) => /\d/.test(pass), 'At least 1 number')

export const userEmailSchema = z
  .object({
    email,
  })
  .strict()

export const userPasswordSchema = z
  .object({
    password,
  })
  .strict()

export const userCredentialsSchema = z
  .object({
    email,
    password,
  })
  .strict()

export type UserCredentialsSchema = z.infer<typeof userCredentialsSchema>
export type UserPasswordSchema = z.infer<typeof userPasswordSchema>
