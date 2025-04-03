import { Request, Response } from "express";
import users from "../Models/User";

export const test = async (req: Request, res: Response) => {
    try {
        res.status(200).json({message: "hello world"})
        } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}