import { Request, Response } from "express"
import Book from "../Models/Book"
import { Types } from "mongoose"
import { updateRating, updateSummary } from "../Middleware/BookReview"
import { Review } from "../Interfaces/Review"

// export const createComment = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const ISBN = req.params.ISBN
//         const review = req.body
//         const userId = req.user?.id

//         review.userId = userId

//         const book = await Book.findOne({ ISBN })
//         if (!book) {
//             res.status(404).send("Book not found")
//             return
//         }

//         book.reviews.push(review)
//         book.rating = updateRating(book)
//         book.reviewSumary = updateSummary(book)

//         const savedBook = await book.save()

//         res.status(200).json(savedBook)
//     } catch (error) {
//         console.log(`Error: ${error}`)
//         res.status(500).send(`Server error ${error}`)
//     }
// }

// export const deleteComment = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const ISBN = req.params.ISBN
//         const reviewId = req.params.reviewId
//         const userId = req.user?.id

//         const book = await Book.findOne({ ISBN })
        
//         if (!book) {
//             res.status(404).send("Book not found")
//             return
//         }
        
//         const review:Review = (book.reviews as Types.DocumentArray<any>).id(reviewId)
//         if (!review) {
//             res.status(404).send(`Review not found`)
//             return
//         }

//         if (review.userId != userId) {
//             res.status(403).send(`Just erase personal review`)
//         }

//         book.reviews = book.reviews.filter(dir => dir._id.toString() !== reviewId)
//         book.rating = updateRating(book)
//         book.reviewSumary = updateSummary(book)

//         await book.save()

//         res.status(200).json(book)
//     } catch (error) {
//         console.log(`Error: ${error}`)
//         res.status(500).send(`Server error: ${error}`)
//     }
// }



export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ISBN, userId } = req.params;
    const { rating, comment } = req.body;

    const book = await Book.findOne({ ISBN });
    if (!book) {
      res.status(404).json({ error: 'Libro no encontrado' });
      return;
    }

    const review = book.reviews?.find(r => r.userId === userId);
    if (!review) {
      res.status(404).json({ error: 'Reseña no encontrada para este usuario' });
      return;
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    review.createdAt = new Date();

    await book.save(); // el middleware que actualiza el promedio
    res.status(200).json(book);
  } catch (error: any) {
    console.error('Error en updateReview:', error);
    res.status(500).json({ 
      error: 'Error al actualizar la reseña',
      details: error.message
    });
  }
};

export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ISBN } = req.params;
    const { userId, rating, comment } = req.body;

    const book = await Book.findOne({ ISBN });
    if (!book) {
      res.status(404).json({ error: 'Libro no encontrado' });
      return;
    }

    // Verificar si el usuario ya dejó una reseña
    const existingReview = book.reviews?.find(r => r.userId === userId);
    if (existingReview) {
      res.status(400).json({ error: 'Ya existe una reseña de este usuario' });
      return;
    }

    book.reviews?.push({
      userId,
      rating,
      comment,
      createdAt: new Date()
    });

    await book.save(); // actualiza el rating promedio
    res.status(201).json(book);
  } catch (error: any) {
    console.error('Error en addReview:', error);
    res.status(500).json({ 
      error: 'Error al agregar reseña',
      details: error.message
    });
  }
};



export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ISBN, userId } = req.params;

    const book = await Book.findOne({ ISBN });
    if (!book) {
      res.status(404).json({ error: 'Libro no encontrado' });
      return;
    }

    // Filtrar todas las reseñas excepto la del userId especificado
    const originalReviewsLength = book.reviews?.length || 0;
    book.reviews = book.reviews?.filter(review => review.userId !== userId);

    if (book.reviews?.length === originalReviewsLength) {
      res.status(404).json({ error: 'Reseña no encontrada para este usuario' });
      return;
    }

    await book.save(); // Guarda el cambio y actualiza el rating promedio si tienes middleware
    res.status(200).json({ message: 'Reseña eliminada correctamente', book });
  } catch (error: any) {
    console.error('Error en deleteReview:', error);
    res.status(500).json({ 
      error: 'Error al eliminar reseña',
      details: error.message
    });
  }
};
