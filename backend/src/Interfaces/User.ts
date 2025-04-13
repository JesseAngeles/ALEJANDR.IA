import { Direction } from "./Direction"
// import { Payment } from "./Payment"

export interface User {
    name: string
    email: string
    password: string
    active: boolean
    directions: Direction[]
    // paymentMethods:  
}