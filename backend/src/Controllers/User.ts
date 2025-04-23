import { Request, Response } from "express"
import users from "../Models/User"
import { generateJWT } from "../Middleware/jwt"
import { returnUser, returnFullUser } from "../Middleware/ReturnFunctions"

// LOGIN
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        const user = await users.findOne({ email })

        if (!user || !await user.comparePassword(password)) {
            res.status(404).send('Invalid email or password')
            return
        }

        const { token, payload } = generateJWT(user)

        res.status(200).json({ token, user: payload })
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.body
        user.directions = []
        user.cards = []

        const newUser = await new users(user)
        const addUser = await newUser.save()

        res.status(200).json(returnUser(addUser))
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUsers = await users.find()

        res.status(200).send(allUsers.map(returnUser))
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: String = req.params.id

        const user = await users.findById(id)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        res.status(200).json(returnFullUser(user))
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;
        const { name, email, password, active } = req.body;

        const user: any = await users.findById(id)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        user.name = name
        user.email = email
        user.password = password
        user.active = active

        const updateUser = await user.save()

        res.status(200).json(returnUser(updateUser));
    } catch (error) {
        console.error(`Error (Controllers/user/update): ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id;

        const user = await users.findById(id)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        await users.findByIdAndDelete(id)

        res.status(200).json(returnUser(user))
    } catch (error) {
        console.error(`Error (Controllers/user/drop): ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
}