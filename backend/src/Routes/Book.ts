import { Router } from 'express'
import { createBook, getBooks, getBookById, updateBook, deleteBook, getRecommendedBooks, getBookByObjectId } from '../Controllers/Book'
import { authenticateToken, authorizeRole } from '../Middleware/jwt'
import { validateRequest } from '../Middleware/ValidateRequest'
import { ValBookSchema } from '../Validations/Book'
import { createComment, deleteComment } from '../Controllers/Review'

const routerBook = Router()

// CRUD (title, author, price, ISBN, stock, image)
routerBook.post('/', authenticateToken, authorizeRole("admin"), validateRequest(ValBookSchema), createBook)
routerBook.get('/', getBooks)
routerBook.get('/recommended/:id', getRecommendedBooks)
routerBook.get('/:ISBN', getBookById)
routerBook.put('/:ISBN', authenticateToken, authorizeRole("admin"), validateRequest(ValBookSchema), updateBook)
routerBook.delete('/:ISBN', authenticateToken, authorizeRole("admin"), deleteBook)
routerBook.get('/id/:id', getBookByObjectId);

// OPINIONES (comment, rating)
routerBook.post('/opinion/:ISBN', authenticateToken, authorizeRole("user"), createComment)
routerBook.delete('/opinion/:ISBN/:reviewId', authenticateToken, deleteComment)


export default routerBook


