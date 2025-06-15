import { z } from "zod"

export const ValGenerateToken = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
})

export const ValVerifyToken = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    token: z
        .string()
        .length(8, "Token must be 8 characters")
        .regex(/^[a-f0-9]{8}$/, "Token must be a valid 8-character hex string"),
});
