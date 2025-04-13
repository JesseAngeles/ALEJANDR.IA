import mongoose from "mongoose"
import { Direction } from "../Interfaces/Direction"


const { Schema } = mongoose

export const directionSchema = new Schema<Direction>({
    name: {
        type: Schema.Types.String,
        unique:true,
        required: true
    },
    number: {
        type: Schema.Types.String,
        required: true
    },
    street: {
        type: Schema.Types.String,
        required: true
    },
    city: {
        type: Schema.Types.String,
        required: true
    },
    zip_code: {
        type: Schema.Types.Number,
        required: true
    },
    state: {
        type: Schema.Types.String,
        required: true
    }
})

export default mongoose.model<Direction>('directions', directionSchema)