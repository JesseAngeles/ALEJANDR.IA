import { Review } from "./Review"

export interface Book {
  title: string
  author: string
  price: number
  ISBN: string
  stock: number
  rating: number 
  reviews: Review[]
  reviewSumary: string
}