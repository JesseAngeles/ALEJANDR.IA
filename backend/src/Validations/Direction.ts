import { z } from "zod"
import { ValidationError } from "../Interfaces/ValidationError"

export const ValDirectionSchema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'Invalid name'),
    number: z
        .string()
        .min(1, 'Number is required')
        .regex(/^[0-9A-Za-z\-]+$/, 'Invalid number format'),
    street: z
        .string()
        .min(1, 'Street is required'),
    city: z
        .string()
        .min(1, 'City is required')
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ.\s]+$/, 'Invalid city name'),
    zip_code: z
        .number()
        .int('Zip code must be an integer')
        .min(10000, 'Zip code must be at least 5 digits') // puedes ajustar este rango si quieres
        .max(99999, 'Zip code must be at most 5 digits'),
    state: z
        .string()
        .min(1, 'State is required')
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'Invalid state name'),
})

export type Direction = z.infer<typeof ValDirectionSchema>

export function validateDirection(direction: any): ValidationError[] {
    const result = ValDirectionSchema.safeParse(direction)
    if (!result.success) {
        return result.error.errors.map(err => ({
            field: String(err.path[0]),
            message: err.message
        }))
    }

    return []
}
