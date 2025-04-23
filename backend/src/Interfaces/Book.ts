export interface Book {
  title: string;
  author: string;
  price: number;
  ISBN: string;
  rating?: number; 
  reviews?: Review[]; 
}

export interface Review {
  userId: string;
  rating: number; 
  comment: string;
  createdAt?: Date;
}
