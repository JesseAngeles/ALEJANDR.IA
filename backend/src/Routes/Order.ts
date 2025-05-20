import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { getUserOrders, getOrders, newOrder, getOrderDetails, setReturnOrder, setSendOrder, setCancelledOrder } from "../Controllers/Order"

const routerOrder = Router()

routerOrder.get('/details/:order', authenticateToken,/*  authorizeRole("user"), */ getOrderDetails)
routerOrder.get('/user', authenticateToken,/*  authorizeRole("user"), */ getUserOrders)
routerOrder.get('', authenticateToken, /* authorizeRole("admin"), */ getOrders)
routerOrder.post('', authenticateToken, /* authorizeRole("user"), */ newOrder)
routerOrder.post('/return/:order', authenticateToken, /* authorizeRole("user"), */ setReturnOrder)
routerOrder.post('/cancel/:order', authenticateToken, /* authorizeRole("user"), */ setCancelledOrder)
routerOrder.post('/state/:order', authenticateToken, /* authorizeRole("admin"), */ setSendOrder)

export default routerOrder