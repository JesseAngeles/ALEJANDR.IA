import mongoose from "mongoose";
import { UserCollection } from "../Interfaces/UserCollection";

const { Schema } = mongoose;

export const userCollectionSchema = new Schema<UserCollection>({
    name: {
        type: String,
        required: true
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: "books1"  // Cambiar de "Book" a "books1"
    }]
});

export default mongoose.model<UserCollection>("UserCollection", userCollectionSchema);