import mongoose from "mongoose";

export interface CartItem {
    bookId: mongoose.Types.ObjectId,
    quantity: Number,
}

export interface Cart {
    items: CartItem[];
}
