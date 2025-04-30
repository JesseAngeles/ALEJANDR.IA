import mongoose from "mongoose";

export interface Discount {
    name: string
    bookIds: mongoose.Types.ObjectId[]
    discount: Number
}
