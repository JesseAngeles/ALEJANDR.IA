import { Direction } from "./Direction"
import { Card } from "./Card"

export interface User {
    name: string
    email: string
    password: string
    active: boolean
    directions: Direction[]
    cards: Card[]
}