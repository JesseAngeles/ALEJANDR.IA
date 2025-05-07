import { Request, Response } from 'express'
import Book from '../Models/Book'

export const searchWithFilter = async (req: Request, res: Response): Promise<void> => {
    try {
        const mongoQueryFilter = req.body

        const books = await Book.find(mongoQueryFilter)

        res.status(200).json(books)
    } catch (error) {
        console.log(`Error: ${error}`)
        if ((error as any).code === 11000) {
            res.status(500).send('Server error: El ISBN ya existe')
        } else {
            res.status(500).send(`Server error: ${error}`)
        }
    }
}
