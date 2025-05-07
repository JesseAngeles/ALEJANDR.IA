import { z } from "zod";

const ReviewSchema = z.object({
  reviewer: z.string().min(1, 'El revisor es obligatorio'),
  comment: z.string().min(1, 'El comentario es obligatorio'),
  rating: z.number().min(0).max(5),
});

export const ValBookSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio'),

  author: z
    .string()
    .min(1, 'El autor es obligatorio'),

  price: z
    .number()
    .min(1, 'El precio es obligatorio')
    .positive('El precio debe ser un número positivo'),

  ISBN: z
    .string()
    .min(1, 'El ISBN es obligatorio') 
    .regex(/^(97(8|9))?\d{9}(\d|X)$/, 'ISBN no válido'), // Validación de formato

  category: z
    .string()
    .min(1, 'La categoría es obligatoria'),

  stock: z
    .number()
    .min(0, 'El stock debe ser al menos 0'),

  rating: z
    .number()
    .min(0, 'La calificación debe ser al menos 0')
    .max(5, 'La calificación debe ser como máximo 5')
    .optional(),

  reviews: z
    .array(ReviewSchema)
    .optional(),

  image: z
    .string()
    .url('La imagen debe ser una URL válida'),
});

export type Book = z.infer<typeof ValBookSchema>;

export function validateBook(book: any) {
  const result = ValBookSchema.safeParse(book);
  if (!result.success) {
    return result.error.errors.map(err => ({
      field: String(err.path[0]),
      message: err.message
    }));
  }
  return [];
}

