import { Router } from "express"
import { authenticateToken } from "../Middleware/jwt"
import { getCollections, getCollectionById, addCollection, addBookToCollection, deleteBookFromCollection, deleteCollection } from "../Controllers/Collection"

const routerCollection = Router()

routerCollection.get("/:id/collection", authenticateToken, getCollections)
routerCollection.post("/:id/collection", authenticateToken, addCollection)
routerCollection.get("/:id/collection/:collection", authenticateToken, getCollectionById)
routerCollection.post("/:id/collection/:collection/book/:book", authenticateToken, addBookToCollection)
routerCollection.delete("/:id/collection/:collection", authenticateToken, deleteCollection)
routerCollection.delete("/:id/collection/:collection/book/:book", authenticateToken, deleteBookFromCollection)

export default routerCollection
