import { z } from "zod";

export const ValUserSchema = z.object({
    name: z
        .string()
        .min(1, 'El nombre es un campo obligatorio')
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'Formato inválido.Utilice letras para el nombre.'),

    email: z
        .string()
        .min(1, 'El email es un campo obligatorio')
        .email('El email no es válido'),

    password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(64, 'La contraseña no puede tener más de 64 caracteres')
        .regex(
            /(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).+/,
            'La contraseña debe contener al menos una letra mayúscula y un carácter especial'
        )
});

export type User = z.infer<typeof ValUserSchema>;

export function validateUser(user: Partial<User>): { field: string; message: string }[] {
    const result = ValUserSchema.safeParse(user);

    if (!result.success) {
        return result.error.errors.map((err) => ({
            field: String(err.path[0]),
            message: err.message
        }));
    }

    return [];
}
