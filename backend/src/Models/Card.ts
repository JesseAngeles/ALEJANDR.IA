import mongoose from "mongoose"
import { Card } from "../Interfaces/Card"

const { Schema } = mongoose

export const cardSchema = new Schema<Card>({
    titular: {
        type: Schema.Types.String,
        required: true
    },
    number: {
        type: Schema.Types.String,
        unique: true,
        required: true,
        sparse: true
    },
    expirationMonth: {
        type: Schema.Types.Number,
        unique: false,
        required: true
    },
    expirationYear: {
        type: Schema.Types.Number,
        unique: false,
        required: true
    },
    securityCode: {
        type: Schema.Types.String,
        unique: false,
        required: false
    }
})

export default mongoose.model<Card>('cards',cardSchema)