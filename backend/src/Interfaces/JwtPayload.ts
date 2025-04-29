import { roles } from "./User"

export interface JwtPayload {
    id: string
    email: string
    name: string
    role: roles
}