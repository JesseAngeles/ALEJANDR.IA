import { Router } from "express"
import { authenticateToken } from "../Middleware/jwt"
import {
    setBookToCart,
    deleteBookFromCart,
    emptyCart
} from "../Controllers/Cart"

const routerCart = Router()

// Add or update book in cart
routerCart.post("/:id/cart/book/:book/quantity/:quantity", authenticateToken, setBookToCart)

// Delete a specific book from the cart
routerCart.delete("/:id/cart/book/:book", authenticateToken, deleteBookFromCart)

// Empty the entire cart
routerCart.delete("/:id/cart", authenticateToken, emptyCart)

export default routerCart
