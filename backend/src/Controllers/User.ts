import { Request, Response } from "express";
import users from "../Models/User";

// Crear nuevo usuario
export const add = async (req:Request, res: Response): Promise<void> => {
    try {
        const { name, email, password } = req.body
        const active:boolean = true

        // TODO validaciones

        // TODO cifrado de contraseña
 
        const newUser = new users({ name, email, password, active })
        const addUser = await newUser.save()
        const returnUser = await users.findById(addUser._id).select({ name, email, password })

        res.status(200).json(returnUser)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

// Obtener a todos los usuarios
export const getAll = async (req:Request, res:Response):Promise<void> => {
    try {
        const allUsers = await users.find()

        res.status(200).send(allUsers)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

// Obtener a usuario por ID
export const getById = async (req:Request, res:Response):Promise<void> => {
    try {
        const id:String = req.params.id
        
        // TODO validaciones

        const user = await users.findById(id)
        if (!user)
        {
            res.status(404).send(`User not found`)
            return
        }

        res.status(200).json(user)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`)
    }
}

// Actualizar la información por ID
export const update = async (req: Request, res: Response):Promise<void> => {
    try {
        const id: string = req.params.id;
        const { name, email, password, active } = req.body;

        // TODO validaciones
        
        const user:any = await users.findById(id)
        if (!user)
        {
            res.status(404).send(`User not found`)
            return
        }

        user.name = name
        user.email = email
        user.password = password
        user.active = active

        const updateUser = await user.save()
        const returnUser = await users.findById(updateUser._id)

        res.status(200).json(returnUser);
    } catch (error) {
        console.error(`Error (Controllers/user/update): ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
}

// Eliminar información por ID
export const drop = async (req: Request, res: Response):Promise<void> => {
    try {
        const id: string = req.params.id;

        // TODO validaciones

        const user = await users.findById(id)
        if (!user) 
        {
            res.status(404).send(`User not found`)
            return
        }

        await users.findByIdAndDelete(id)
            
        res.status(200).json(user)
    } catch (error) {
        console.error(`Error (Controllers/user/drop): ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
}