import mongoose from "mongoose";
import { CartItem } from "./Cart";

export interface Order {
    date: Date,
    client: mongoose.Types.ObjectId,
    total: Number,
    state: String,
    items: CartItem[],
    noItems: Number,
}
