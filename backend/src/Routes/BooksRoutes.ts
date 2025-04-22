import { Router } from 'express';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../Controllers/BookController';

const router = Router();

router.post('/', createBook);           
router.get('/', getBooks);              
router.get('/:ISBN', getBookById);       
router.put('/:ISBN', updateBook);        
router.delete('/:ISBN', deleteBook);     

export default router;
