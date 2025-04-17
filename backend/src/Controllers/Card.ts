import { Request, Response } from "express"
import users from "../Models/User"
import { Types } from "mongoose"
import { returnCard } from "../Middleware/ValidationFunctions"

export const addCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.params.id
        const card = req.body

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).send('Invalid user ID')
            return
        }

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        user.cards.push(card)
        await user.save()
        const newCard = user.cards[user.cards.length - 1]
        res.status(200).json(returnCard(newCard))
    } catch (error) {
        console.log(`Error ${error}`)
        res.status(500).send(`Server error ${error}`)
    }
}

export const getCards = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.params.id

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).send('Invalid user ID')
            return
        }

        const cards = await users.findById(userId).select('cards')
        if (!cards) {
            res.status(404).send(`User not found`)
            return
        }

        const safeCards = cards.cards.map(returnCard)

        res.status(200).json(safeCards)
    } catch (error) {
        console.log(`Error ${error}`)
        res.status(500).send(`Server error ${error}`)
    }
}

export const getCardById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.params.id
        const cardId: string = req.params.card

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).send('Invalid user ID')
            return
        }

        if (!Types.ObjectId.isValid(cardId)) {
            res.status(400).send('Invalid card ID')
            return
        }

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        const card = (user.cards as Types.DocumentArray<any>).id(cardId)
        res.status(200).json(returnCard(card))
    } catch (error) {
        console.log(`Error ${error}`)
        res.status(500).send(`Server error ${error}`)
    }
}

export const deleteCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.params.id
        const cardId: string = req.params.card

        if (!Types.ObjectId.isValid(userId)) {
            res.status(400).send('Invalid user ID')
            return
        }

        if (!Types.ObjectId.isValid(cardId)) {
            res.status(400).send('Invalid card ID')
            return
        }

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        const card = (user.cards as Types.DocumentArray<any>).id(cardId)
        if (!card) {
            res.status(404).send(`Card not found`)
            return
        }

        user.cards = user.cards.filter(dir => dir._id.toString() !== cardId)
        await user.save()

        res.status(200).json(returnCard(card))
    } catch (error) {
        console.log(`Error ${error}`)
        res.status(500).send(`Server error ${error}`)
    }
}