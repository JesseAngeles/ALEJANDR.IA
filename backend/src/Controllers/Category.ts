import { Request, Response } from "express"
import { Category } from "../Models/Category"

export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find({}, { name: 1, _id: 0 });
        const categoryNames = categories.map(category => category.name);

        res.status(200).json(categoryNames);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`);
    }
};
