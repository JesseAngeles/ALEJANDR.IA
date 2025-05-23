import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { Books, Clients, Sales, State } from "../Controllers/Reports"

const routerReport = Router()

routerReport.get("/sales", Sales)
routerReport.get("/books", Books)
routerReport.get("/clients", Clients)
routerReport.get("/states", State)

export default routerReport