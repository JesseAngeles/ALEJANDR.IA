import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import {
    getDiscounts,
    getDiscount,
    addDiscount,
    addBookToDiscount,
    removeBookFromDiscount,
    removeDiscount,
    updateDiscount,
    getAllDiscounts
} from "../Controllers/Discount"

const routerDiscount = Router()

// CRUD discounts
routerDiscount.post("/", authenticateToken, authorizeRole("admin"), addDiscount)
routerDiscount.get("", authenticateToken, getAllDiscounts)
routerDiscount.get("/:discount", authenticateToken, getDiscount)
routerDiscount.put("/:discount", authenticateToken, authorizeRole("admin"), updateDiscount)
routerDiscount.delete("/:discount", authenticateToken, authorizeRole("admin"), removeDiscount)

// CRUD books un discounts
routerDiscount.post("/:discount/book/:ISBN", authenticateToken, authorizeRole("admin"), addBookToDiscount)
routerDiscount.get("/book/:ISBN", authenticateToken, getDiscounts)
routerDiscount.delete("/:discount/book/:ISBN", authenticateToken, authorizeRole("admin"), removeBookFromDiscount)

export default routerDiscount
