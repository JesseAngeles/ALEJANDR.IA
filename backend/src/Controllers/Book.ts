import { Request, Response, NextFunction } from 'express'
import Book from '../Models/Book'
import { Category } from '../Models/Category'

export const createBook = async (req: Request, res: Response): Promise<void> => {
	try {
		const book = req.body

		const newBook = await new Book(book)
		const addedBook = await newBook.save()

		const categoryName = book.category;
		let category = await Category.findOne({ name: categoryName });

		if (!category) {
			category = new Category({ name: categoryName });
			await category.save();
		}

		res.status(200).json(addedBook)
	} catch (error) {
		console.log(`Error: ${error}`)
		if ((error as any).code === 11000) {
			res.status(500).send('Server error: El ISBN ya existe')
		} else {
			res.status(500).send(`Server error: ${error}`)
		}
	}
}

 
export const getBooks = async (req: Request, res: Response): Promise<void> => {
	try {
		const books = await Book.find()
		res.status(200).json(books)
	} catch (error) {
		res.status(500).json({ error: 'Error al obtener libros' })
	}
}

//TODO Sistema de recomendaciones
export const getRecommendedBooks = async (req: Request, res: Response): Promise<void> => {
	try {
		const books = await Book.find()
		const midpoint = Math.floor(books.length / 2);
		const returnBooks = [
			{
				name: "colección 1",
				books: books.slice(0, midpoint)
			},
			{
				name: "colección 2",
				books: books.slice(midpoint)
			}]
		res.status(200).json(returnBooks)
	} catch (error) {
		res.status(500).send(`Server error: ${error}`)
	}
}


export const getBookById = async (req: Request, res: Response): Promise<void> => {
	try {
		const { ISBN } = req.params

		const book = await Book.findOne({ ISBN })
		if (!book) {
			res.status(404).json({
				error: 'Libro no encontrado',
				suggestion: 'Verifica que el ISBN sea correcto'
			})
			return
		}

		res.status(200).json(book)
	} catch (error: unknown) {
		console.error('Error en getBookById:', error)
		const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
		res.status(500).json({
			error: 'Error al obtener el libro',
			details: errorMessage
		})
	}
}


export const updateBook = async (req: Request, res: Response): Promise<void> => {
	try {
		const { ISBN } = req.params
		const updateData = req.body

		const updatedBook = await Book.findOneAndUpdate(
			{ ISBN: ISBN }, 
			updateData,
			{ new: true, runValidators: true }
		)

		if (!updatedBook) {
			res.status(404).json({ error: 'Libro no encontrado para actualizar' })
			return
		}

		res.status(200).json(updatedBook)
	} catch (error: any) {
		console.error('Error en updateBook:', error)
		res.status(500).json({
			error: 'Error al actualizar el libro',
			details: error.message
		})
	}
}

export const getBookByObjectId = async (req: Request, res: Response): Promise<void> => {
	try {
	  const { id } = req.params;
  
	  const book = await Book.findById(id);
	  if (!book) {
		res.status(404).json({
		  error: 'Libro no encontrado',
		  suggestion: 'Verifica que el ID sea correcto'
		});
		return;
	  }
  
	  res.status(200).json(book);
	} catch (error: unknown) {
	  console.error('Error en getBookByObjectId:', error);
	  const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
	  res.status(500).json({
		error: 'Error al obtener el libro por ID',
		details: errorMessage
	  });
	}
  };
  

export const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { ISBN } = req.params
		const deletedBook = await Book.findOneAndDelete({ ISBN: ISBN })

		if (!deletedBook) {
			res.status(404).json({ error: 'Libro no encontrado para eliminar' })
			return
		}

		res.status(200).json({ message: 'Libro eliminado correctamente' })
	} catch (error) {
		res.status(500).json({ error: 'Error al eliminar el libro' })
	}
}




















// import { Request, Response, NextFunction } from 'express';
// import Book from '../Models/Book';



// export const createBook = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const book = new Book(req.body);
//     const savedBook = await book.save();
//     res.status(201).json(savedBook);
//   } catch (error: any) {
//     if (error.code === 11000) {
//       res.status(400).json({ error: 'El ISBN ya existe' });
//     } else {
//       res.status(400).json({ 
//         error: 'Error al crear libro',
//         details: error.message
//       });
//     }
//   }
// };

// export const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const books = await Book.find();
//     res.status(200).json(books);
//   } catch (error) {
//     res.status(500).json({ error: 'Error al obtener libros' });
//   }
// };


// export const getBookById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { ISBN } = req.params;
    
//     const book = await Book.findOne({ ISBN });

//     if (!book) {
//       res.status(404).json({ 
//         error: 'Libro no encontrado',
//         suggestion: 'Verifica que el ISBN sea correcto'
//       });
//       return;
//     }

//     res.status(200).json(book);
//   } catch (error: unknown) {
//     console.error('Error en getBookById:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
//     res.status(500).json({ 
//       error: 'Error al obtener el libro',
//       details: errorMessage
//     });
//   }
// };




// export const updateBook = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { ISBN } = req.params;
//     const updateData = req.body;

//     const updatedBook = await Book.findOneAndUpdate(
//       { ISBN: ISBN }, // Busca por ISBN
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!updatedBook) {
//       res.status(404).json({ error: 'Libro no encontrado para actualizar' });
//       return;
//     }

//     res.status(200).json(updatedBook);
//   } catch (error: any) {
//     console.error('Error en updateBook:', error);
//     res.status(500).json({ 
//       error: 'Error al actualizar el libro',
//       details: error.message 
//     });
//   }
// };




// export const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   try {
//     const { ISBN } = req.params;
//     const deletedBook = await Book.findOneAndDelete({ ISBN: ISBN });

//     if (!deletedBook) {
//       res.status(404).json({ error: 'Libro no encontrado para eliminar' });
//       return;
//     }

//     res.status(200).json({ message: 'Libro eliminado correctamente' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error al eliminar el libro' });
//   }
// };



