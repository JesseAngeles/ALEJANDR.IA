import { Direction } from "../Interfaces/Direction"
import mongoose from "mongoose"

const { Schema } = mongoose

const directionSchema = new Schema<Direction>({
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
        required:true
    }
})

export default mongoose.model<Direction>('directions',directionSchema)