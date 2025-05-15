import { Request, Response } from "express";
import books from "../Models/Book";
import users from "../Models/User";
import orders from "../Models/Order";
import { Server } from "socket.io";
import { ObjectId, Types } from "mongoose";
import { Direction } from "../Interfaces/Direction";
import { Card } from "../Interfaces/Card";
import nodemailer from "nodemailer";

const sendNotificationEmail = async (userEmail: string, orderId: string, subject: string, message: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject,
            html: `<p>${message}</p>`,
        });
        console.log(`Email sent to ${userEmail} for order ${orderId}`);
    } catch (error) {
        console.error(`Error sending email to ${userEmail} for order ${orderId}: ${error}`);
    }
};

const updateOrderState = async (io: Server, orderId: Types.ObjectId, newState: string) => {
    try {
        const order = await orders.findById(orderId);
        if (!order) return false;

        if (order.state !== "Cancelado") {
            order.state = newState;
            await order.save();

            io.emit(`orderStatus:${order._id}`, { state: newState });
            console.log(`Order ${order._id} state updated to ${newState}`);
            return true;
        }
    } catch (error) {
        console.error(`Error updating order state for ${orderId}: ${error}`);
    }
    return false;
};

export const newOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { cardId, directionId } = req.body;

        const user = await users.findById(userId);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        if (!cardId || !directionId) {
            res.status(404).send("Card and Direction not found");
            return;
        }

        let total = 0;
        let totalItems = 0;

        for (const cartItem of user.cart.items) {
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

        user.cart.items = [];
        user.orders.push(newOrder._id);
        await user.save();

        const io = req.app.get("socketio");
        await updateOrderState(io, newOrder._id, "Pendiente");

        res.status(200).json(newOrder);

        setTimeout(async () => {
            const updated = await updateOrderState(io, newOrder._id, "En Preparación");
            if (updated) {
                const userEmail = user.email || "";
                await sendNotificationEmail(
                    userEmail,
                    newOrder._id.toString(),
                    'Tu pedido está en preparación',
                    `Tu pedido: ${newOrder._id.toString().slice(-8)} está ahora en <strong>preparación</strong>.`
                );
            }
        }, 15 * 1000);

    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const setOrderStateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.order;
        const { state } = req.body;

        const io = req.app.get("socketio");
        const updated = await updateOrderState(io, new Types.ObjectId(orderId), state);

        if (!updated) {
            res.status(404).send("Order not found or already canceled");
            return;
        }

        res.status(200).json({ orderId, state });

        const order = await orders.findById(orderId);
        const user = await users.findById(order?.client);
        const userEmail = user?.email || "";

        if (state === "Enviado") {
            setTimeout(async () => {
                const inTransit = await updateOrderState(io, new Types.ObjectId(orderId), "En Tránsito");
                if (inTransit) {
                    await sendNotificationEmail(
                        userEmail,
                        orderId,
                        'Tu pedido está en tránsito',
                        `Tu paquete: ${orderId.slice(-8)} está ahora en <strong>tránsito</strong>.`
                    );
                }
            }, 30 * 1000);

            setTimeout(async () => {
                const delivered = await updateOrderState(io, new Types.ObjectId(orderId), "Entregado");
                if (delivered) {
                    await sendNotificationEmail(
                        userEmail,
                        orderId,
                        'Tu paquete ha sido entregado',
                        `Tu paquete: ${orderId.slice(-8)} ha sido <strong>entregado</strong> correctamente.`
                    );
                }
            }, 30 * 1000);

        } else if (state === "En Devolución") {
            setTimeout(async () => {
                const returned = await updateOrderState(io, new Types.ObjectId(orderId), "Devuelto");
                if (returned) {
                    await sendNotificationEmail(
                        userEmail,
                        orderId,
                        'Tu paquete ha sido devuelto',
                        `Tu paquete: ${orderId.slice(-8)} ha sido <strong>devuelto</strong> correctamente.`
                    );
                }
            }, 30 * 1000);
        }

    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.order

        const orderDetails = await orders.findById(orderId)
            .populate<{ client: { _id: ObjectId, name: string, directions: Types.DocumentArray<Direction>, cards: Types.DocumentArray<Card> } }>("client", "name directions cards")
            .populate({
                path: "items",
                populate: {
                    path: "bookId",
                    select: "author title price image"
                }
            })
            .exec();

        if (!orderDetails) {
            res.status(404).send('Order not found')
            return;
        }

        if (!orderDetails.client || !(orderDetails.client as any)._id) {
            res.status(404).send('Client information not found');
            return;
        }

        const client = orderDetails.client;
        const direction = client.directions.id(orderDetails.direction);
        const card = client.cards.id(orderDetails.card);

        const returnedDetails = {
            _id: orderDetails._id,
            date: orderDetails.date,
            client: {
                _id: orderDetails.client._id,
                name: orderDetails.client.name,
            },
            card,
            direction,
            total: orderDetails.total,
            state: orderDetails.state,
            items: orderDetails.items,
            noItems: orderDetails.noItems,
        };

        res.status(200).json(returnedDetails);
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
