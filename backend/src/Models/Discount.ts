import mongoose from "mongoose"
import { Schema } from "mongoose"
import { Discount } from "../Interfaces/Discount"

export const DiscountSchema = new Schema<Discount>({
    bookIds: [{ type: Schema.Types.ObjectId, ref: "Book", required: false }],
    discount: { type: Number, required: true },
})

export default mongoose.model<Discount>("Discounts", DiscountSchema);
