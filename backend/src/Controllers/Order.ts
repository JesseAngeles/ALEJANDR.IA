import { Request, Response } from "express";
import orders from "../Models/Order";

export const getOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const allOrders = await orders.find();
        res.status(200).json(allOrders);
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const setOrderStateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.id;
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
