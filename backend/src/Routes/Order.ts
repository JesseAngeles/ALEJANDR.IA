import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { getOrders, newOrder, setOrderStateById } from "../Controllers/Order"

const routerOrder = Router()

routerOrder.get('', authenticateToken, authorizeRole("admin"), getOrders)
routerOrder.post('', authenticateToken, authorizeRole("admin"), newOrder)
routerOrder.post('/state', authenticateToken, authorizeRole("admin"), setOrderStateById)

export default routerOrder
