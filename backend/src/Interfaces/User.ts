import { Direction } from "./Direction"
import { Card } from "./Card"

export interface User {
    _id?: string
    name: string
    email: string
    password: string
    active: boolean
    directions: Direction[]
    cards: Card[]
}