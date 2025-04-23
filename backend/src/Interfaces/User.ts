import { Direction } from "./Direction"
import { Card } from "./Card"
import { Collection } from "mongoose"
import { Cart } from "./Cart"

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
    collections: Collection[]
    cart: Cart
}
