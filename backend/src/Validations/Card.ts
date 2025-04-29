import { z } from "zod"
import { luhn } from "../Middleware/ValidationFunctions"
import { ValidationError } from "../Interfaces/ValidationError"

export const ValCardSchema = z.object({
    titular: z
        .string()
        .min(1, 'Titular is required')
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'Invalid titular name'),
    number: z
        .string()
        .regex(/^[0-9]{13,19}$/, 'Card number must be 13 to 19 digits')
        .refine(luhn, { message: 'Invalid card number format' }),
    expirationMonth: z
        .number()
        .int()
        .min(1, 'Expiration month must be between 1 and 12')
        .max(12, 'Expiration month must be between 1 and 12'),
    expirationYear: z
        .number()
        .min(new Date().getFullYear(), 'Card expired'),
    securityCode: z
        .string()
        .regex(/^[0-9]{3,4}$/, 'Security code must be 3 or 4 digits')
}).refine(
    (card) => {
        const now = new Date()
        const thisMonth = now.getMonth() + 1
        const thisYear = now.getFullYear()

        if (card.expirationYear === thisYear) {
            return card.expirationMonth >= thisMonth
        }

        return true
    },
    {
        message: 'Card expired',
        path: ['expirationMonth']
    }
)

export type Card = z.infer<typeof ValCardSchema>

export function validateCard(card: any): ValidationError[] {
    const result = ValCardSchema.safeParse(card)
    if (!result.success) {
        return result.error.errors.map(err => ({
            field: String(err.path[0]),
            message: err.message
        }))
    }

    return []
}