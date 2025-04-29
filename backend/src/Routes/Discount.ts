import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import {
    getDiscounts,
    getDiscount,
    addDiscount,
    addBookToDiscount,
    removeBookFromDiscount,
    removeDiscount,
    updateDiscount
} from "../Controllers/Discount"

const routerDiscount = Router()

// Obtener todos los descuentos aplicables a un libro
routerDiscount.get("/book/:book", authenticateToken, authorizeRole("admin"), getDiscounts)

// Obtener un descuento específico
routerDiscount.get("/:discount", authenticateToken, authorizeRole("admin"), getDiscount)

// Crear nuevo descuento
routerDiscount.post("/", authenticateToken, authorizeRole("admin"), addDiscount)

// Agregar libro a descuento
routerDiscount.post("/:discount/book/:book", authenticateToken, authorizeRole("admin"), addBookToDiscount)

// Quitar libro de descuento
routerDiscount.delete("/:discount/book/:book", authenticateToken, authorizeRole("admin"), removeBookFromDiscount)

// Eliminar descuento
routerDiscount.delete("/:discount", authenticateToken, authorizeRole("admin"), removeDiscount)

// Actualizar valor del descuento
routerDiscount.put("/:discount", authenticateToken, authorizeRole("admin"), updateDiscount)

export default routerDiscount
