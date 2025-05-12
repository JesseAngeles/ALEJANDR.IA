import { Request, Response } from "express";
import books from "../Models/Book";
import users from "../Models/User";
import orders from "../Models/Order";
import { CartItem } from "../Interfaces/Cart";
import { Order } from "../Interfaces/Order";

export const newOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { cardId, directionId } = req.body

        const user = await users.findById(userId);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        let total = 0;
        let totalItems = 0;

        for (const cartItem of user.cart.items as CartItem[]) {
            const book = await books.findById(cartItem.bookId);
            const price = book?.price || 0;
            total += cartItem.quantity * price;
            totalItems += cartItem.quantity;
        }

        const newOrder = await orders.create({
            date: new Date(),
            client: userId,
            card: cardId,
            direction: directionId,
            total,
            state: "Pendiente",
            items: user.cart.items,
            noItems: totalItems,
        });

        user.cart.items = []
        user.orders.push(newOrder._id)
        await user.save()

        res.status(200).json(newOrder);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.order

        const orderDetails = await orders.findById(orderId).populate("client", "name")
            .populate({
                path: "items",
                populate: {
                    path: "bookId",
                    select: "author title price image"
                }
            })
            .populate("card")
            .populate("direction")
            .exec();

        res.status(200).json(orderDetails);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id

        const user = await users.findById(userId)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        const userOrders = await orders.find({ client: userId }).populate("client", "name")

        res.status(200).json(userOrders);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const allOrders = await orders.find().populate("client", "name");
        res.status(200).json(allOrders);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const setOrderStateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.order;
        const { state } = req.body;

        const order = await orders.findById(orderId);
        if (!order) {
            res.status(404).send("Order not found");
            return;
        }

        order.state = state;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};
