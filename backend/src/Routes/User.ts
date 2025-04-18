import { Router } from "express"
import { loginUser, addUser, deleteUser, getAllUsers, getUserById, updateUser } from "../Controllers/User"
import { addDirection, deleteDirection, getDirectionById, getDirections, updateDirection } from "../Controllers/Direction"
import { addCard, deleteCard, getCardById, getCards } from "../Controllers/Card"

import { authenticateToken } from "../Middleware/jwt"
import { validateRequest } from "../Middleware/ValidateRequest"

import { ValCardSchema } from "../Validations/Card"
import { ValDirectionSchema } from "../Validations/Direction"
import { ValUserSchema } from "../Validations/User"


const routerUser = Router()

// Login user
routerUser.post('/login', loginUser)

// CRUD user
routerUser.post('', validateRequest(ValUserSchema),addUser)
routerUser.get('', getAllUsers)
routerUser.get('/:id', getUserById)
routerUser.put('/:id', authenticateToken, validateRequest(ValUserSchema),updateUser)
routerUser.delete('/:id', authenticateToken, deleteUser)

// CRUD Directions
routerUser.post('/:id/direction', authenticateToken, validateRequest(ValDirectionSchema),addDirection)
routerUser.get('/:id/direction/', authenticateToken, getDirections)
routerUser.get('/:id/direction/:direction', authenticateToken, getDirectionById)
routerUser.put('/:id/direction/:direction', authenticateToken, validateRequest(ValDirectionSchema),updateDirection)
routerUser.delete('/:id/direction/:direction', authenticateToken, deleteDirection)

// CRUD Cards
routerUser.post('/:id/card', authenticateToken, validateRequest(ValCardSchema),addCard)
routerUser.get('/:id/card/', authenticateToken, getCards)
routerUser.get('/:id/card/:card', authenticateToken, getCardById)
routerUser.delete('/:id/card/:card', authenticateToken, deleteCard)

export default routerUser