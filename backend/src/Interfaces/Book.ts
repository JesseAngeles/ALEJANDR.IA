<<<<<<< Updated upstream
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
=======
export interface Book {
    id: Number;
    titulo: String;
    autor: String;
    precio: Number;
    imagen: String;
    cantidad: Number;
}
>>>>>>> Stashed changes
