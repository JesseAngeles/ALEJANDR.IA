
import { Schema, model } from 'mongoose';
import { Book, Review } from '../Interfaces/Book';

const ReviewSchema = new Schema<Review>({
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const BookSchema = new Schema<Book>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  ISBN: { type: String, required: true, unique: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [ReviewSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// se puede utilizar Middleware para actualizar el rating promedio
BookSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = parseFloat((total / this.reviews.length).toFixed(1));
  }
  next();
});

export default model<Book>('Book', BookSchema);
