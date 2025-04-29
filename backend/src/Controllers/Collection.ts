import { Request, Response } from "express"
import users from "../Models/User"
import mongoose from "mongoose"

export const addCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id
        const collection = req.body

        const user = await users.findById(userId)
        user?.collections.push(collection)
        await user?.save()

        const newCollection = user?.collections[user?.collections.length - 1]
        res.status(200).json(newCollection)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

export const addBookToCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id
        const bookId = req.params.book
        const collectionId = req.params.collection

        const user = await users.findById(userId)

        const collection = (user?.collections as mongoose.Types.DocumentArray<any>).id(collectionId)

        collection.push(bookId)

        res.status(200).json(user?.collections)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

export const deleteBookFromCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id
        const collectionId = req.params.collection
        const bookId = req.params.book

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send("Usuario no encontrado")
            return
        }

        const collection = (user.collections as mongoose.Types.DocumentArray<any>).id(collectionId)
        if (!collection) {
            res.status(404).send("Colección no encontrada")
            return
        }

        collection.books = collection.books.filter((b: mongoose.Types.ObjectId | string) => b.toString() !== bookId)

        await user.save()

        res.status(200).json(collection)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

export const getCollections = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id
        const user = await users.findById(userId)
        res.status(200).json(user?.collections)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

export const getCollectionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id
        const collectionId = req.params.collection

        const user = await users.findById(userId)
        const collection = (user?.collections as mongoose.Types.DocumentArray<any>).id(collectionId)

        res.status(200).json(collection)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

export const deleteCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id
        const collectionId = req.params.collection

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`Usuario no encontrado`)
            return
        }

        const collection = (user.collections as mongoose.Types.DocumentArray<any>).id(collectionId)

        user.collections = (user.collections as mongoose.Types.DocumentArray<any>).filter(col => col._id.toString() !== collectionId)
        await user.save()

        res.status(200).json(collection)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`)
    }
}
