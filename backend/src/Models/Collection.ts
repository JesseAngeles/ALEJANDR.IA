import mongoose from "mongoose"
import { Collection } from "../Interfaces/Collection"

const { Schema } = mongoose

export const collectionSchema = new Schema<Collection>({
    name: {
        type: Schema.Types.String,
        required: true,
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: "books"  // Cambiar de "Book" a "books1"
    }],
});

export default mongoose.model<Collection>("Collection", collectionSchema);
