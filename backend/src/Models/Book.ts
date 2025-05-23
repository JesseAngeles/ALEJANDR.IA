import { Schema, model } from 'mongoose'
import { Book } from '../Interfaces/Book'
import { reviewSchema } from './Review'


const BookSchema = new Schema<Book>({
  title: {
    type: Schema.Types.String,
    required: true
  },
  image: {
    type: Schema.Types.String,
    required: true,
    unique: false
  },
  author: {
    type: Schema.Types.String,
    required: true
  },
  category: {
    type: Schema.Types.String,
    required: true
  },
  price: {
    type: Schema.Types.Number,
    required: true,
    min: 0
  },
  stock: {
    type: Schema.Types.Number,
    required: true,
    min: 0,
    unique: false
  },
  ISBN: {
    type: Schema.Types.String,
    required: true,
    unique: true
  },
  rating: {
    type: Schema.Types.Number,
    default: 0,
    min: 0,
    max: 5
  },
  sinopsis: {
    type: Schema.Types.String,
    required: false
  },
  reviews: {
    type: [reviewSchema],
    default: [],
    unique: false,
    required: false
  },
  reviewSumary: {
    type: Schema.Types.String,
    unique: false,
    required: false
  }
})

BookSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0)
    this.rating = parseFloat((total / this.reviews.length).toFixed(1))
  }
  next()
})

export default model<Book>('Book', BookSchema)



