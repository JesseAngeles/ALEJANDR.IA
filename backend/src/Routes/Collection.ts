import { Router } from "express"
import { authenticateToken, authorizeRole } from "../Middleware/jwt"
import { getCollections, getCollectionById, addCollection, addBookToCollection, deleteBookFromCollection, deleteCollection, renameCollection } from "../Controllers/Collection"

const routerCollection = Router()

// CRUD collections (name, books: [])
routerCollection.post("", authenticateToken, authorizeRole("user"), addCollection)
routerCollection.get("", authenticateToken, authorizeRole("user"), getCollections)
routerCollection.get("/:collection", authenticateToken, authorizeRole("user"), getCollectionById)
routerCollection.put("/:collection", authenticateToken, authorizeRole("user"), renameCollection)
routerCollection.delete("/:collection", authenticateToken, authorizeRole("user"), deleteCollection)

// CRUD item collection
routerCollection.post("/:collection/book/:ISBN", authenticateToken, authorizeRole("user"), addBookToCollection)
routerCollection.delete("/:collection/book/:ISBN", authenticateToken, authorizeRole("user"), deleteBookFromCollection)

export default routerCollection
