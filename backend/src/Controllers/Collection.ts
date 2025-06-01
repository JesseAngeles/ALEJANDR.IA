import { Request, Response } from "express"
import users from "../Models/User"
import mongoose from "mongoose"
import Book from "../Models/Book"
import { updateUserRecommendations } from "../Middleware/UpdateRecommendations"

export const addCollection = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const collection = req.body;
  
      const user = await users.findById(userId);
      if (!user) {
        res.status(404).send(`User not found`);
        return;
      }
  
      const nameNormalizado = collection.name?.trim().toLowerCase();
  
      user.collections = user.collections.filter(
        (col: any) => col.name?.trim().toLowerCase() !== nameNormalizado
      );
  
      user.collections.push(collection);
      await user.save();
  
      const newCollection = user.collections[user.collections.length - 1];
      res.status(200).json(newCollection);
    } catch (error) {
      console.log(`Error: ${error}`);
      res.status(500).send(`Error del servidor: ${error}`);
    }
  };
  
  
  
  
  

export const getCollections = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id
        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`Usuario no encontrado`)
            return
        }

        res.status(200).json(user?.collections)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`)
    }
}

export const getCollectionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id; // ← CORRECTO
      const collectionId = req.params.collection;
  
      if (!userId) {
        res.status(401).send("No autorizado");
        return;
      }
  
      const user = await users.findById(userId);
      if (!user) {
        res.status(404).send("Usuario no encontrado");
        return;
      }
  
      const collection = (user.collections as mongoose.Types.DocumentArray<any>).id(collectionId);
      if (!collection) {
        res.status(404).send("Colección no encontrada");
        return;
      }
  
      res.status(200).json(collection);
    } catch (error) {
      console.log(`Error: ${error}`);
      res.status(500).send(`Error del servidor: ${error}`);
    }
  };
  

export const renameCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id
        const collectionId = req.params.collection
        const name = req.body.name

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`Usuario no encontrado`)
            return
        }

        const collection = (user.collections as mongoose.Types.DocumentArray<any>).id(collectionId)
        collection.name = name
        await user.save()

        res.status(200).json(collection)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`)
    }
}


export const deleteCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id
        const collectionId = req.params.collection

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`Usuario no encontrado`)
            return
        }

        const collection = (user.collections as mongoose.Types.DocumentArray<any>).id(collectionId)

        user.collections = (user.collections as mongoose.Types.DocumentArray<any>).filter(col => col._id.toString() !== collectionId)
        await user.save()

        res.status(200).json(collection)
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`)
    }
}


export const addBookToCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const ISBN = req.params.ISBN;
        const collectionId = req.params.collection;

        if (!userId) {
            res.status(400).send("User ID is required");
            return;
        }

        console.time("findUser");
        const user = await users.findById(userId).select("collections");
        console.timeEnd("findUser");

        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        void updateUserRecommendations(userId);

        console.time("findBook");
        const book = await Book.findOne({ ISBN });
        console.timeEnd("findBook");

        if (!book) {
            res.status(404).send("Book not found");
            return;
        }

        const collection = (user.collections as mongoose.Types.DocumentArray<any>).id(collectionId);
        collection.books.push(String(book._id));
        await user.save();

        res.status(200).json(collection);
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Error del servidor: ${error}`);
    }
};


export const deleteBookFromCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id
        const collectionId = req.params.collection
        const ISBN = req.params.ISBN

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send("Usuario no encontrado")
            return
        }
        if (!userId) {
            res.status(400).send("User ID is required");
            return;
        }
        const book = await Book.findOne({"ISBN" : ISBN})
        if (!book) {
            res.status(404).send(`Book not found`)
            return
        }

        const collection = (user.collections as mongoose.Types.DocumentArray<any>).id(collectionId)
        if (!collection) {
            res.status(404).send("Colección no encontrada")
            return
        }

        void updateUserRecommendations(userId);
        collection.books = collection.books.filter((b: mongoose.Types.ObjectId | string) => b.toString() !== String(book._id))

        await user.save()

        res.status(200).json(collection)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}