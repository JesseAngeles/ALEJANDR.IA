import mongoose from "mongoose";

export interface CartItem {
    bookId: mongoose.Types.ObjectId,
    quantity: number,
}

export interface Cart {
    items: CartItem[];
}
