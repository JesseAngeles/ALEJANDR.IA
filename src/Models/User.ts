import { User } from "../Interfaces/User"
import mongoose from "mongoose"

const { Schema } = mongoose

const user = new Schema<User>({
    name: {
        type: Schema.Types.String,
        required: true
    },
    phone: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: false
    }
})

export default mongoose.model<User>('users',user)