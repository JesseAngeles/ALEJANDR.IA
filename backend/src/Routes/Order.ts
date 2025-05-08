import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { getUserOrders, getOrders, newOrder, setOrderStateById } from "../Controllers/Order"

const routerOrder = Router()

routerOrder.get('/user', authenticateToken,/*  authorizeRole("user"), */ getUserOrders)
routerOrder.get('', authenticateToken, /* authorizeRole("admin"), */ getOrders)
routerOrder.post('', authenticateToken, /* authorizeRole("admin"), */ newOrder)
routerOrder.post('/state', authenticateToken, /* authorizeRole("admin"), */ setOrderStateById)

export default routerOrder
