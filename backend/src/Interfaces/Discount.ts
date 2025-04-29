import mongoose from "mongoose";

export interface Discount {
    bookIds: mongoose.Types.ObjectId[],
    discount: Number,
}
