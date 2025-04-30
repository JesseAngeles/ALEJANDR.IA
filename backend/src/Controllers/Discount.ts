import { Request, Response } from "express"
import Discounts from "../Models/Discount"
import mongoose from "mongoose"
import Book from "../Models/Book"

// Crear un nuevo descuento
export const addDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, discount } = req.body
        const newDiscount = await Discounts.create({ name, discount, bookIds: [] })
        res.status(201).json(newDiscount)
    } catch (error) {
        console.error("Error al crear el descuento:", error)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

// Obtener un descuento específico por ID
export const getAllDiscounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const discounts = await Discounts.find()

        res.status(200).json(discounts)
    } catch (error) {
        console.error("Error al obtener el descuento:", error)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

// Obtener un descuento específico por ID
export const getDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { discount } = req.params

        const discountDoc = await Discounts.findById(discount)
        if (!discountDoc) {
            res.status(404).send("Descuento no encontrado")
            return
        }

        res.status(200).json(discountDoc)
    } catch (error) {
        console.error("Error al obtener el descuento:", error)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

// Actualizar el valor del descuento
export const updateDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { discount } = req.params
        const { name, discount: newDiscountValue } = req.body

        const updatedDiscount = await Discounts.findByIdAndUpdate(
            discount,

            { name: name, discount: newDiscountValue },
            { new: true }
        )

        if (!updatedDiscount) {
            res.status(404).send("Descuento no encontrado")
            return
        }

        res.status(200).json(updatedDiscount)
    } catch (error) {
        console.error("Error al actualizar el descuento:", error)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}


// Eliminar un descuento completamente
export const removeDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { discount } = req.params
        const deletedDiscount = await Discounts.findByIdAndDelete(discount)
        if (!deletedDiscount) {
            res.status(404).send("Descuento no encontrado")
            return
        }

        res.status(200).json(deletedDiscount)
    } catch (error) {
        console.error("Error al eliminar el descuento:", error)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

// Agregar un libro a un descuento
export const addBookToDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { discount, ISBN } = req.params
        const discountDoc = await Discounts.findById(discount)
        if (!discountDoc) {
            res.status(404).send("Descuento no encontrado")
            return
        }

        const book = await Book.findOne({ "ISBN": ISBN })
        if (!book) {
            res.status(404).send(`Book not found`)
            return
        }

        discountDoc.bookIds.push(new mongoose.Types.ObjectId(book._id));
        await discountDoc.save()

        res.status(200).json(discountDoc)
    } catch (error) {
        console.error("Error al agregar libro al descuento:", error)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

// Obtener todos los descuentos que incluyen un libro específico
export const getDiscounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { ISBN } = req.params

        const book = await Book.findOne({"ISBN" : ISBN})
        if (!book) {
            res.status(404).send(`Book not found`)
            return
        } 

        const discounts = await Discounts.find({ bookIds: { $in: [book._id] } })
        res.status(200).json(discounts)
    } catch (error) {
        console.error("Error al obtener descuentos del libro:", error)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

// Eliminar un libro de un descuento
export const removeBookFromDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { discount, ISBN } = req.params
        const discountDoc = await Discounts.findById(discount)
        if (!discountDoc) {
            res.status(404).send("Descuento no encontrado")
            return
        }

        const book = await Book.findOne({"ISBN" : ISBN})
        if (!book) {
            res.status(404).send(`Book not found`)
            return
        } 


        discountDoc.bookIds = discountDoc.bookIds.filter(id => id.toString() !== String(book._id))
        await discountDoc.save()

        res.status(200).json(discountDoc)
    } catch (error) {
        console.error("Error al eliminar libro del descuento:", error)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}