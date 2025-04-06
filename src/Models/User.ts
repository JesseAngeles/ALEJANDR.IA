import { User } from "../Interfaces/User"
import DirectionSchema from "./Direction"
import PaymentSchema from "./Payment"
import mongoose from "mongoose"

const { Schema } = mongoose

const userSchema = new Schema<User>({
    name: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    active: {
        type: Schema.Types.Boolean,
        required: true
    }
})

export default mongoose.model<User>('users', userSchema)