import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { getOrders, setOrderStateById } from "../Controllers/Order"

const routerOrder = Router()

routerOrder.get('', authenticateToken, authorizeRole("admin"), getOrders)
routerOrder.post('', authenticateToken, authorizeRole("admin"), setOrderStateById)

export default routerOrder
