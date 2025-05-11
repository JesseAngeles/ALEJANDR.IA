import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { getUserOrders, getOrders, newOrder, setOrderStateById, getOrderDetails } from "../Controllers/Order"

const routerOrder = Router()

routerOrder.get('/details/:order', authenticateToken,/*  authorizeRole("user"), */ getOrderDetails)
routerOrder.get('/user', authenticateToken,/*  authorizeRole("user"), */ getUserOrders)
routerOrder.get('', authenticateToken, /* authorizeRole("admin"), */ getOrders)
routerOrder.post('', authenticateToken, /* authorizeRole("user"), */ newOrder)
routerOrder.post('/state/:order', authenticateToken, /* authorizeRole("admin"), */ setOrderStateById)

export default routerOrder
