import { Router } from "express"
import { loginUser, addUser, deleteUser, getAllUsers, getUserById, updateUser, multipleUser, getUser, updateUserPassword } from "../Controllers/User"
import { addDirection, deleteDirection, getDirectionById, getDirections, updateDirection } from "../Controllers/Direction"
import { addCard, deleteCard, getCardById, getCards } from "../Controllers/Card"
import { getCachedRecommendations, getUserFavorites } from "../Controllers/User"



import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { validateRequest } from "../Middleware/ValidateRequest"

import { ValCardSchema } from "../Validations/Card"
import { ValDirectionSchema } from "../Validations/Direction"
import { ValUserPassSchema, ValUserSchema } from "../Validations/User"

const routerUser = Router()

// Pruebas
routerUser.get('/test', getAllUsers)
routerUser.post('/test', multipleUser)
routerUser.get('/test/:id', getUserById)
routerUser.delete('/:id', authenticateToken, deleteUser)
routerUser.get('/favorites/:id', getUserFavorites);
routerUser.get('/recommendations/:id', getCachedRecommendations)

// Login user
routerUser.post('/login', loginUser)

// CRUD USER (name, email, password)
routerUser.post('', validateRequest(ValUserSchema), addUser)
routerUser.post('/pass', authenticateToken, authorizeRole("user"), validateRequest(ValUserPassSchema), updateUserPassword)
routerUser.get('', authenticateToken, authorizeRole("user"), getUser)
routerUser.put('', authenticateToken, authorizeRole("user"), validateRequest(ValUserSchema), updateUser)
routerUser.delete('', authenticateToken, authorizeRole("user"), deleteUser)

// CRUD DIRECTIONS (name, number, street, city, zip_code, state)
routerUser.post('/direction', authenticateToken, authorizeRole("user"), validateRequest(ValDirectionSchema), addDirection)
routerUser.get('/direction/', authenticateToken, authorizeRole("user"), getDirections)
routerUser.get('/direction/:direction', authenticateToken, authorizeRole("user"), getDirectionById)
routerUser.put('/direction/:direction', authenticateToken, authorizeRole("user"), validateRequest(ValDirectionSchema), updateDirection)
routerUser.delete('/direction/:direction', authenticateToken, authorizeRole("user"), deleteDirection)

// CRUD CARDS (titular, number, expirationMonth, expirationYear, securityCode)
// -> (titular, last4, expirationMonth, expirationyear)
routerUser.post('/card', authenticateToken, authorizeRole("user"), validateRequest(ValCardSchema), addCard)
routerUser.get('/card', authenticateToken, authorizeRole("user"), getCards)
routerUser.get('/card/:card', authenticateToken, authorizeRole("user"), getCardById)
routerUser.delete('/card/:card', authenticateToken, authorizeRole("user"), deleteCard)

export default routerUser
