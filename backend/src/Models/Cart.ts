import mongoose from "mongoose"
import { Cart, CartItem } from "../Interfaces/Cart"
import { Schema } from "mongoose"

export const cartItemSchema = new Schema<CartItem>({
    bookId: { type: Schema.Types.ObjectId, ref: "Books", required: true },
    quantity: { type: Number, min: 1, required: true },
})

export const cartSchema = new Schema<Cart>({
    items: { type: [cartItemSchema], required: false },
})

export const cartItemModel = mongoose.model<CartItem>("CartItem", cartItemSchema);
export const cartModel = mongoose.model<Cart>("Cart", cartSchema);
