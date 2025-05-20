import { z } from "zod"

export const ValGenerateToken = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
})

export const ValRestoreToken = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  token: z
    .string()
    .length(8, "Token must be 8 characters")
    .regex(/^[a-f0-9]{8}$/, "Token must be a valid 8-character hex string"),
  newPassword: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(64, 'Password must have less than 64 characters')
    .regex(
      /(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).+/,
      'New password must contain at least one uppercase letter and one special character'
    )
});
