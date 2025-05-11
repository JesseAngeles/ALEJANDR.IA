import { Schema, model } from 'mongoose'
import { Order } from '../Interfaces/Order'
import { cartItemSchema } from './Cart'

export const OrderSchema = new Schema<Order>({
    date: {
        type: Schema.Types.Date,
        required: true,
    },
    client: {
        type: Schema.Types.ObjectId, ref: "users",
        required: true,
    },
    card: {
        type: Schema.Types.ObjectId, ref: "cards",
        required: true,
    },
    direction: {
        type: Schema.Types.ObjectId, ref: "directions",
        required: true,
    },
    total: {
        type: Schema.Types.Number,
        required: true,
    },
    state: {
        type: Schema.Types.String,
        required: true,
    },
    items: {
        type: [cartItemSchema],
        required: true,
    },
    noItems: {
        type: Schema.Types.Number,
        required: true,
    },
})

export default model<Order>('orders', OrderSchema)
