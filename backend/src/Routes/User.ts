import { Router } from "express";
import { loginUser, addUser, deleteUser, getAllUsers, getUserById, updateUser } from "../Controllers/User";
import { addDirection, deleteDirection, getDirectionById, getDirections, updateDirection } from "../Controllers/Direction"
import { authenticateToken } from "../Middleware/jwt";

const routerUser = Router()

routerUser.post('/login', loginUser)

// CRUD user
routerUser.post('', addUser);
routerUser.get('', getAllUsers);
routerUser.get('/:id', getUserById);
routerUser.put('/:id', authenticateToken, updateUser);
routerUser.delete('/:id', authenticateToken, deleteUser);

// CRUD Direction
routerUser.post('/:id/direction', authenticateToken, addDirection)
routerUser.get('/:id/direction/', authenticateToken, getDirections)
routerUser.get('/:id/direction/:direction', authenticateToken, getDirectionById)
routerUser.put('/:id/direction/:direction', authenticateToken, updateDirection)
routerUser.delete('/:id/direction/:direction', authenticateToken, deleteDirection)

//TODO Payment methods
// routerUser.post('/:id/payment', addDirection)
// routerUser.get('/:id/payment/', getDirections)
// routerUser.get('/:id/payment/:payment', getDirectionById)
// routerUser.delete('/:id/payment', deleteDirection)

export default routerUser