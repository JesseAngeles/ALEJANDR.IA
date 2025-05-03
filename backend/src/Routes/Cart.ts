import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { getCart, setBookToCart, deleteBookFromCart, emptyCart, createTicket } from "../Controllers/Cart"

const routerCart = Router()

// CRUD de items del carrito
routerCart.get("/", authenticateToken, authorizeRole("user"), getCart)
routerCart.post("/:ISBN", authenticateToken, authorizeRole("user"), setBookToCart)
routerCart.delete("/:ISBN", authenticateToken, authorizeRole("user"), deleteBookFromCart)
routerCart.delete("", authenticateToken, authorizeRole("user"), emptyCart)

routerCart.post("", authenticateToken, authorizeRole("user"), createTicket)

export default routerCart
