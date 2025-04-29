import { ZodSchema } from 'zod'
import { Request, Response, NextFunction, RequestHandler } from 'express'

export const validateRequest = (schema: ZodSchema): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                error: result.error.errors.map(err => ({
                    field: String(err.path[0]),
                    message: err.message
                }))
            })
            return
        }

        req.body = result.data
        next()
    }
}
