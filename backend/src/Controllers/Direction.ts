import { Request, Response } from "express";
import users from "../Models/User";
import { Types } from "mongoose";
import { returnDirection } from "../Middleware/ReturnFunctions"

export const addDirection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.params.id
        const direction = req.body

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`user not found`)
            return
        }

        user.directions.push(direction)
        await user.save()
        res.status(200).json(returnDirection(direction))
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

export const getDirections = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.params.id

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`user not found`)
            return
        }

        res.status(200).json(user.directions.map(returnDirection))
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

export const getDirectionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id
        const directionId = req.params.direction

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`user not found`)
            return
        }

        const direction = (user.directions as Types.DocumentArray<any>).id(directionId);
        res.status(200).json(returnDirection(direction))
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}


export const updateDirection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.params.id
        const directionId = req.params.direction
        const newDirection = req.body

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`user not found`)
            return
        }

        const direction = (user.directions as Types.DocumentArray<any>).id(directionId);
        direction.name = newDirection.name
        direction.number = newDirection.number
        direction.street = newDirection.street
        direction.city = newDirection.city
        direction.zip_code = newDirection.zip_code
        direction.state = newDirection.state

        await user.save()
        res.status(200).json(returnDirection(direction))
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

export const deleteDirection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId: string = req.params.id
        const directionId = req.params.direction

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`user not found`)
            return
        }

        const direction = (user.directions as Types.DocumentArray<any>).id(directionId);
        if (!direction) {
            res.status(404).send("Direction not found");
            return;
        }

        user.directions = user.directions.filter(dir => dir._id.toString() !== directionId);
        await user.save();

        res.status(200).json(returnDirection(direction))
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}