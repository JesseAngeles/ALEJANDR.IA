import { Router } from 'express'
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../Controllers/Book'
import { authenticateToken, authorizeRole } from '../Middleware/jwt'
import { validateRequest } from '../Middleware/ValidateRequest'
import { ValBookSchema } from '../Validations/Book'
import { createComment, deleteComment } from '../Controllers/Review'

const routerBook = Router()

// CRUD
routerBook.post('/', authenticateToken, authorizeRole("admin"), validateRequest(ValBookSchema), createBook)
routerBook.get('/', getBooks)
routerBook.get('/:ISBN', getBookById)
routerBook.put('/:ISBN', authenticateToken, authorizeRole("admin"), validateRequest(ValBookSchema), updateBook)
routerBook.delete('/:ISBN', authenticateToken, authorizeRole("admin"), deleteBook)

// OPINIONES
routerBook.post('/:ISBN', authenticateToken, createComment)
routerBook.delete('/:ISBN/:reviewId', authenticateToken, deleteComment)

export default routerBook
