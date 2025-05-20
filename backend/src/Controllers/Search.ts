import { Request, Response } from 'express';
import Book from '../Models/Book';

export const searchWithFilter = async (req: Request, res: Response): Promise<void> => {
  try {
    const termino = req.body.query;

    if (!termino || typeof termino !== "string") {
      res.status(400).send("Falta el término de búsqueda.");
      return;
    }

    const regex = { $regex: termino, $options: "i" };

    // Buscar por título o por autor (soportando arreglo o string)
    const books = await Book.find({
      $or: [
        { title: regex },
        { author: regex },           // Para strings
        { author: { $elemMatch: regex } } // Para arreglos de autores
      ]
    });
    res.status(200).json(books);
  } catch (error: any) {
    console.error("❌ Error al buscar libros:", error.message || error);
    res.status(500).send(`Server error: ${error.message || error}`);
  }
};
