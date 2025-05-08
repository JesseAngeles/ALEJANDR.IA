import mongoose from "mongoose"
import { ICategory } from "../Interfaces/Category"
import { Schema } from "mongoose"

export const categorySchema = new Schema<ICategory>({
    name: {
        type: Schema.Types.String,
        required: true, unique: true,
    },
})

export const Category = mongoose.model<ICategory>("categories", categorySchema);
