import { Direction } from "./Direction"
import { Card } from "./Card"
import mongoose, { Collection } from "mongoose"
import { Cart } from "./Cart"
import { Order } from "./Order"

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
    recommendations?: any[] 
    cart: Cart,
    orders: mongoose.Types.ObjectId[],
}
