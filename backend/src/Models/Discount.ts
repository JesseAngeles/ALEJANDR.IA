import mongoose from "mongoose"
import { Schema } from "mongoose"
import { Discount } from "../Interfaces/Discount"

export const DiscountSchema = new Schema<Discount>({
    name: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    bookIds: [{
        type: Schema.Types.ObjectId,
        ref: "books1",  // Cambiar de "Book" a "books1"
        required: false
    }],
    discount: {
        type: Number,
        required: true
    },
})

export default mongoose.model<Discount>("Discounts", DiscountSchema);
