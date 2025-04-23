import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { addAdmin, getUsers } from "../Controllers/Admin"

const routerAdmin = Router()

routerAdmin.post('', authenticateToken, authorizeRole("admin"), addAdmin)
routerAdmin.get('', authenticateToken, authorizeRole("admin"), getUsers)


export default routerAdmin