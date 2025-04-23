import { Schema } from 'mongoose';

import { Review } from '../Interfaces/Review';

export const reviewSchema = new Schema<Review>({
    userId: {
        type: Schema.Types.String,
        required: true
    },
    rating: {
        type: Schema.Types.Number,
        required: true,
        min: 0,
        max: 5
    },
    comment: {
        type: Schema.Types.String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
