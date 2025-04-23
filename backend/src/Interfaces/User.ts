import { Direction } from "./Direction"
import { Card } from "./Card"

export enum roles {
    user = "user",
    admin = "admin"
}

export interface User {
    _id?: string
    name: string
    email: string
    password: string
    active: boolean
    role: roles
    directions: Direction[]
    cards: Card[]
}