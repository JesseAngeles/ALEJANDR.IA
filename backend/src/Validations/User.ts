import { z } from "zod"
import { ValidationError } from "../Interfaces/ValidationError"

export const ValUserSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'Invalid name'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email format'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(64, 'Password must have less than 64 characters')
        .regex(
            /(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).+/,
            'Password must contain at least one uppercase letter and one special character'
        ),
    active: z
        .boolean({
            required_error: 'Active status is required'
        })
})

export type User = z.infer<typeof ValUserSchema>

export function validateUser(user: any): ValidationError[] {
    const result = ValUserSchema.safeParse(user)
    if (!result.success) {
        return result.error.errors.map(err => ({
            field: String(err.path[0]),
            message: err.message
        }))
    }

    return []
}
