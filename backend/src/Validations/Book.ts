import { z } from "zod"
import { ValidationError } from "../Interfaces/ValidationError"

// Esquema para validar un review básico si lo estás usando (opcional)
const ReviewSchema = z.object({
  reviewer: z.string().min(1, 'Reviewer is required'),
  comment: z.string().min(1, 'Comment is required'),
  rating: z.number().min(0).max(5),
})

export const ValBookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required'),

  author: z
    .string()
    .min(1, 'Author is required'),

  price: z
    .number()
    .positive('Price must be a positive number'),

  ISBN: z
    .string()
    .regex(/^(97(8|9))?\d{9}(\d|X)$/, 'Invalid ISBN'),

  stock: z
    .number()
    .min(0, 'Stock must be at least 0'),

  rating: z
    .number()
    .min(0, 'Rating must be at least 0')
    .max(5, 'Rating must be at most 5')
    .optional(),

  reviews: z
    .array(ReviewSchema)
    .optional(),
    
  image: z
  .string()
  .url('Image must be a valid URL'),

  category: z
    .string()

})

export type Book = z.infer<typeof ValBookSchema>

export function validateBook(book: any): ValidationError[] {
  const result = ValBookSchema.safeParse(book)
  if (!result.success) {
    return result.error.errors.map(err => ({
      field: String(err.path[0]),
      message: err.message
    }))
  }

  return []
}
