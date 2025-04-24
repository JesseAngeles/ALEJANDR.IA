import { Request, Response } from "express"
import users from "../Models/User"
import { cartItemModel } from "../Models/Cart"

export const setBookToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id
        const bookId = req.params.book
        const quantity = req.params.quantity

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send("Usuario no encontrado")
            return
        }

        const existingItem = user.cart.items.find((item: any) => item.bookId.toString() === bookId)

        if (existingItem) {
            existingItem.quantity = Number(quantity)
        } else {
            user.cart.items.push(new cartItemModel({ bookId, quantity }))
        }

        await user.save()
        res.status(200).json(user.cart)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

export const deleteBookFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id
        const bookId = req.params.book

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send("Usuario no encontrado")
            return
        }

        user.cart.items = user.cart.items.filter((item: any) => item.bookId.toString() !== bookId)
        await user.save()

        res.status(200).json(user.cart)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

export const emptyCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send("Usuario no encontrado")
            return
        }

        user.cart.items = []
        await user.save()

        res.status(200).json({ message: "Carrito vaciado con éxito" })
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

