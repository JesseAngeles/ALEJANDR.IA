import mongoose from "mongoose";

export interface Collection {
    name: String,
    books: mongoose.Types.ObjectId[],
}
