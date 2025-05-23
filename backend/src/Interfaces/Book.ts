// import { Review } from "./Review"

// export interface Book {
//   _id: string
//   title: string
//   author: string
//   price: number
//   ISBN: string
//   stock: number
//   rating: number 
//   reviews: Review[]
//   reviewSumary: string
//   image: string
// }


import { Review } from "./Review"

export interface Book {
  _id: string
  title: string
  author: string
  price: number
  ISBN: string
  stock: number
  rating: number 
  reviews: Review[]
  sinopsis: string
  reviewSumary: string
  image: string
  category: string
}


// export interface Book {
//   _id: string
//   title: string;
//   image: string;
//   author: string;
//   category: string;
//   price: number;  
//   stock: number;
//   ISBN: string;
//   rating?: number;
//   sinopsis: string;
//   reviews?: Review[];
//   reviewSumary: string;
// }
