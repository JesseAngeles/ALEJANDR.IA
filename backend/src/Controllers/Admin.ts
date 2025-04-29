import { Request, Response } from "express"
import users from "../Models/User"
import { returnUser } from "../Middleware/ReturnFunctions"

export const addAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.body

        //TODO generador de contraseñas
        admin.password = "1234"
        admin.role = "admin"
        admin.active = true

        const newUser = await new users(admin)
        const addUser = await newUser.save()

        res.status(200).json(addUser)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const findRole = req.body.role || "user"
        const allUsers = await users.find({ role: findRole })

        res.status(200).send(allUsers.map(returnUser))
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

