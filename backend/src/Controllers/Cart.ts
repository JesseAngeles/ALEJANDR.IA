import { Request, Response } from "express"
import users from "../Models/User"
import { cartItemModel } from "../Models/Cart"
import Book from "../Models/Book"
import { returnUser } from "../Middleware/ReturnFunctions"

export const setBookToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id
        const ISBN = req.params.ISBN
        const quantity = req.body.quantity || 1

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        const book = await Book.findOne({ ISBN }).select("_id")

        if (!book) {
            res.status(404).send('Book not found')
            return
        }

        const existingItem = user.cart.items.find((item: any) => item.bookId.toString() === String(book._id))

        if (existingItem && quantity)
            existingItem.quantity = Number(quantity)
        else
            user.cart.items.push(new cartItemModel({ "bookId": String(book._id), "quantity": quantity }))

        await user.save()
        res.status(200).json(user.cart)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const deleteBookFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id
        const ISBN = req.params.ISBN

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send("User not found")
            return
        }

        const book = await Book.findOne({"ISBN" : ISBN}).select("_id")
        if (!book) {
            res.status(404).send(`Book not found`)
            return
        }

        user.cart.items = user.cart.items.filter((item: any) => item.bookId.toString() !== String(book._id))
        await user.save()

        res.status(200).json(user.cart)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const emptyCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send("Usuario no encontrado")
            return
        }

        user.cart.items = []
        await user.save()

        res.status(200).json(returnUser(user))
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

// TODO Función estructura para el pago del carrito
export const createTicket = async (req: Request, res:Response): Promise<void> => {
    try {
        const userId = req.user?.id
        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send("Usuario no encontrado")
            return
        }

        res.status(200).json(user.cart)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}