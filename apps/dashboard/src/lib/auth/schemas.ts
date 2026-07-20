import { z } from 'zod'

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .pipe(z.email('Enter a valid email address'))

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .pipe(
    z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be at most 128 characters')
  )
