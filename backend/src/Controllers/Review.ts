import { Request, Response } from "express"
import Book from "../Models/Book"
import { Types } from "mongoose"
import { updateRating, updateSummary } from "../Middleware/BookReview"
import { Review } from "../Interfaces/Review"

export const createComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const ISBN = req.params.ISBN
        const review = req.body
        const userId = req.user?.id

        review.userId = userId

        const book = await Book.findOne({ ISBN })
        if (!book) {
            res.status(404).send("Book not found")
            return
        }

        book.reviews.push(review)
        book.rating = updateRating(book)
        book.reviewSumary = updateSummary(book)

        const savedBook = await book.save()

        res.status(200).json(savedBook)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error ${error}`)
    }
}

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const ISBN = req.params.ISBN
        const reviewId = req.params.reviewId
        const userId = req.user?.id

        const book = await Book.findOne({ ISBN })
        
        if (!book) {
            res.status(404).send("Book not found")
            return
        }
        
        const review:Review = (book.reviews as Types.DocumentArray<any>).id(reviewId)
        if (!review) {
            res.status(404).send(`Review not found`)
            return
        }

        if (review.userId != userId) {
            res.status(403).send(`Just erase personal review`)
        }

        book.reviews = book.reviews.filter(dir => dir._id.toString() !== reviewId)
        book.rating = updateRating(book)
        book.reviewSumary = updateSummary(book)

        await book.save()

        res.status(200).json(book)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}