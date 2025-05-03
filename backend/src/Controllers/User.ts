import { Request, Response } from "express"
import users from "../Models/User"
import { generateJWT } from "../Middleware/jwt"
import { returnUser, returnFullUser } from "../Middleware/ReturnFunctions"
import Collection from "../Models/Collection"

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
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.body
        user.directions = []
        user.cards = []
        user.cart = {}
        user.active = true

        const seeLaterCollection = new Collection({ name: "Ver más tarde" })
        user.collections = [seeLaterCollection]

        const newUser = await new users(user)
        const addUser = await newUser.save()

        res.status(200).json(returnUser(addUser))
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send(`Unauthorized: No user find in token`)
            return
        }

        const userId = req.user.id
        const user = await users.findById(userId)

        if (!user) {
            res.status(404).send("User not found")
            return
        }

        res.status(200).json(returnFullUser(user))
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send(`Unauthorized: No user find in token`)
            return
        }

        const id: string = req.user.id
        const { name, email, password } = req.body
        const active = req.body.active || true

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

        res.status(200).json(returnUser(updateUser))
    } catch (error) {
        console.error(`Error (Controllers/user/update): ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send(`Unauthorized: No user find in token`)
            return
        }

        const id: string = req.user.id

        const user = await users.findById(id)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        await users.findByIdAndDelete(id)

        res.status(200).json(returnUser(user))
    } catch (error) {
        console.error(`Error (Controllers/user/drop): ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}


//! **********FUNCIONES DE PRUEBA**********

//! Función para la generación de datos de prueba
export const multipleUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const usersData = req.body
        const savedUsers = []

        for (const userData of usersData) {
            userData.directions = []
            userData.cards = []
            userData.cart = {}
            userData.active = true

            const seeLaterCollection = new Collection({ name: "Ver más tarde" })
            userData.collections = [seeLaterCollection]

            const newUser = new users(userData)
            const savedUser = await newUser.save()
            savedUsers.push(savedUser)
        }

        res.status(200).json(savedUsers)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

//! Función para realizar pruebas sobre la consulta de usuarios
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUsers = await users.find()

        res.status(200).send(allUsers)

    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

//! Función de prueba para obtener a cualquier usuario por su ID
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
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}