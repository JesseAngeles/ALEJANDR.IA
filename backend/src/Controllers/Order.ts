import { Request, Response } from "express";
import books from "../Models/Book";
import users from "../Models/User";
import orders from "../Models/Order";
import { Server } from "socket.io";
import { ObjectId, Types } from "mongoose";
import nodemailer from "nodemailer";
import { Direction } from "../Interfaces/Direction";
import { Card } from "../Interfaces/Card";

const REQUIRED_PREVIOUS_STATE: Record<string, string> = {
    "Cancelado": "En Preparación",
    "Enviado": "En Preparación",
    "En Devolución": "Entregado"
};

const updateOrderState = async (io: Server, orderId: Types.ObjectId, newState: string) => {
    try {
        const order = await orders.findById(orderId);
        if (!order) return false;

        const requiredState = REQUIRED_PREVIOUS_STATE[newState];
        if (requiredState && order.state !== requiredState) {
            console.log(`Cannot change order ${order._id} to ${newState} - current state is ${order.state}`);
            return null;
        }

        if (order.state === "Cancelado") {
            console.log(`Order ${order._id} is cancelled. State change to ${newState} is not allowed.`);
            return false;
        }

        order.state = newState;
        await order.save();

        io.emit(`orderStatus:${order._id}`, { state: newState });
        console.log(`Order ${order._id} state updated to ${newState}`);
        return true;
    } catch (error) {
        console.error(`Error updating order state for ${orderId}: ${error}`);
        return false;
    }
};

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

const getUserEmail = async (orderId: string): Promise<string> => {
    const order = await orders.findById(orderId);
    if (!order) return "";
    const user = await users.findById(order.client);
    return user?.email || "";
};

const delayAndUpdateState = async (
    io: Server,
    orderId: Types.ObjectId,
    transitions: { state: string; subject: string; message: (id: string) => string; delay: number }[],
    userEmail: string
) => {
    for (const { state, subject, message, delay } of transitions) {
        await new Promise<void>((resolve) => {
            setTimeout(async () => {
                try {
                    const updated = await updateOrderState(io, orderId, state);
                    if (updated) {
                        await sendNotificationEmail(userEmail, orderId.toString(), subject, message(orderId.toString()));
                    }
                } catch (error) {
                    console.error(`Error actualizando estado a "${state}": ${error}`);
                }
                resolve();
            }, delay);
        });
    }
};

export const newOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { cardId, directionId } = req.body;

        if (!userId) {
            res.status(401).send("Unauthorized: User ID missing");
            return;
        }

        const user = await users.findById(userId);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        if (!cardId || !directionId) {
            res.status(400).send("Card and Direction are required");
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
                if (userEmail) {
                    await sendNotificationEmail(
                        userEmail,
                        newOrder._id.toString(),
                        'Tu pedido está en preparación',
                        `Tu pedido: ${newOrder._id.toString().slice(-8)} está ahora en <strong>preparación</strong>.`
                    );
                }
            }
        }, 15 * 1000);

    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const setCancelledOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.order;
        const io = req.app.get("socketio");

        const updated = await updateOrderState(io, new Types.ObjectId(orderId), "Cancelado");

        if (updated === null) {
            res.status(400).send(`El pedido no se puede cancelar porque no está en "En Preparación"`);
            return;
        }

        if (!updated) {
            res.status(404).send("Pedido no encontrado o ya cancelado");
            return;
        }

        res.status(200).json({ orderId, state: "Cancelado" });

        const userEmail = await getUserEmail(orderId);
        if (userEmail) {
            await sendNotificationEmail(
                userEmail,
                orderId,
                'Tu pedido ha sido cancelado',
                `Tu pedido: ${orderId.slice(-8)} ha sido <strong>cancelado</strong> correctamente.`
            );
        }
    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const setReturnOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.order;
        const io = req.app.get("socketio");

        const updated = await updateOrderState(io, new Types.ObjectId(orderId), "En Devolución");
        if (updated === null) {
            res.status(400).send(`El pedido no se puede devolver porque no está en "Entregado"`);
            return;
        }

        if (!updated) {
            res.status(404).send("Pedido no encontrado o no en estado adecuado");
            return;
        }

        res.status(200).json({ orderId, state: "En Devolución" });

        const userEmail = await getUserEmail(orderId);
        if (!userEmail) return;

        const transitions = [
            {
                state: "Devuelto",
                subject: "Tu paquete ha sido devuelto",
                message: (id: string) => `Tu paquete: ${id.slice(-8)} ha sido <strong>devuelto</strong> correctamente.`,
                delay: 30 * 1000,
            },
        ];

        await delayAndUpdateState(io, new Types.ObjectId(orderId), transitions, userEmail);

    } catch (error) {
        console.error(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const setSendOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.order;
        const io = req.app.get("socketio");

        const updated = await updateOrderState(io, new Types.ObjectId(orderId), "Enviado");
        if (updated === null) {
            res.status(400).send(`El pedido no se puede enviar porque no está en "En Preparación"`);
            return;
        }

        if (!updated) {
            res.status(404).send("Pedido no encontrado o no en estado adecuado");
            return;
        }

        res.status(200).json({ orderId, state: "Enviado" });

        const userEmail = await getUserEmail(orderId);
        if (!userEmail) return;

        const transitions = [
            {
                state: "En Tránsito",
                subject: "Tu pedido está en tránsito",
                message: (id: string) => `Tu paquete: ${id.slice(-8)} está ahora en <strong>tránsito</strong>.`,
                delay: 30 * 1000,
            },
            {
                state: "Entregado",
                subject: "Tu paquete ha sido entregado",
                message: (id: string) => `Tu paquete: ${id.slice(-8)} ha sido <strong>entregado</strong> correctamente.`,
                delay: 30 * 1000,
            },
        ];

        await delayAndUpdateState(io, new Types.ObjectId(orderId), transitions, userEmail);

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
