import { Request, Response } from "express";
import books from "../Models/Book";
import users from "../Models/User";
import orders from "../Models/Order";
import { Server } from "socket.io";
import mongoose, { ObjectId, Types } from "mongoose";
import nodemailer from "nodemailer";
import { Direction } from "../Interfaces/Direction";
import { Card } from "../Interfaces/Card";

const getServerUrl = () =>
    process.env.SERVER_URL && process.env.SERVER_URL.trim() !== ""
        ? process.env.SERVER_URL
        : "http://localhost:5173";

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

const sendNotificationEmail = async (
    userEmail: string,
    orderId: string,
    subject: string,
    message: string,
    state: string = "Pendiente"
) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const serverUrl = getServerUrl();
        const orderDetailsUrl = `${serverUrl}/account/history`;

        const html = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f9f9f9; padding: 40px 0;">
            <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 3px 12px rgba(0,0,0,0.07);">
                <h2 style="text-align:center; color: #820000; margin-bottom: 0.6em; margin-top: 2em;">¡Hola!</h2>
                <div style="padding: 0 38px 18px 38px;">
                    <p style="color: #444; font-size: 1.08em; margin-bottom: 1.2em;">
                        Esperamos que te encuentres bien. Somos la librería <strong>ALEJANDR.IA</strong> y te contactamos para informarte lo siguiente sobre tu pedido:
                    </p>
                    <p style="color: #444; font-size: 1.1em; margin-bottom: 1.2em;">
                        ${message}
                    </p>
                    <div style="text-align:center; margin-bottom: 18px;">
                        <a href="${orderDetailsUrl}" target="_blank"
                            style="background-color: #820000; color: #fff; padding: 13px 32px; border-radius: 6px; text-decoration: none; font-size: 1em; font-weight: 600; display: inline-block;">
                            Ver tus pedidos
                        </a>
                    </div>
                    <p style="color: #999; font-size: 0.92em; text-align:center; margin-top:18px;">
                        Si tienes dudas, contáctanos:<br>
                        <a href="mailto:${process.env.EMAIL_USER}" style="color: #820000;">${process.env.EMAIL_USER}</a><br>
                        Gracias por confiar en nosotros.
                    </p>
                </div>
            </div>
        </div>
        `;

        await transporter.sendMail({
            from: `"ALEJANDR.IA" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject,
            html,
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
    transitions: {
        state: string;
        subject: string;
        message: (id: string) => string;
        delay: number,
        emailState: string
    }[],
    userEmail: string
) => {
    for (const { state, subject, message, delay, emailState } of transitions) {
        await new Promise<void>((resolve) => {
            setTimeout(async () => {
                try {
                    const updated = await updateOrderState(io, orderId, state);

                    // ⬇️ Solo cuando el estado es 'Devuelto', reponemos stock
                    if (updated && state === "Devuelto") {
                        await restoreOrderBooksStock(orderId);
                    }

                    if (updated) {
                        await sendNotificationEmail(
                            userEmail,
                            orderId.toString(),
                            subject,
                            message(orderId.toString()),
                            emailState || state // fallback por si no se define
                        );
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
    const session = await mongoose.startSession();

    try {
        const userId = req.user?.id;
        const { cardId, directionId } = req.body;

        if (!userId) {
            res.status(401).send("Unauthorized: User ID missing");
            return;
        }

        const user = await users.findById(userId).session(session);
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
        let bookUpdates = [];

        // ** Validar stock **
        for (const cartItem of user.cart.items) {
            const book = await books.findById(cartItem.bookId).session(session);
            if (!book) {
                res.status(400).send(`Cannot find the book with Id ${cartItem.bookId}`);
                return;
            }
            const price = book.price || 0;
            const stock = book.stock || 0;
            if (cartItem.quantity > stock) {
                res.status(400).send("Cannot buy more books than the available stock");
                return;
            }
            total += cartItem.quantity * price;
            totalItems += cartItem.quantity;
            bookUpdates.push({ book, newStock: stock - cartItem.quantity });
        }

        // ** Transacción **
        await session.withTransaction(async () => {
            // Actualizar stocks
            for (const { book, newStock } of bookUpdates) {
                await books.updateOne(
                    { _id: book._id, stock: { $gte: book.stock } }, // Checa que nadie más haya cambiado el stock
                    { $set: { stock: newStock } },
                    { session }
                );
            }

            // Crear la orden
            const newOrderDoc = await orders.create([{
                date: new Date(),
                client: userId,
                card: cardId,
                direction: directionId,
                total,
                state: "Pendiente",
                items: user.cart.items,
                noItems: totalItems,
            }], { session });

            // Limpiar carrito y vincular orden al usuario
            user.cart.items = [];
            user.orders.push(newOrderDoc[0]._id);
            await user.save({ session });

            // Responder (dentro de la transacción para asegurar que todo fue bien)
            res.status(200).json(newOrderDoc[0]);

            // Notificar por socket (esto puede ir después de la transacción)
            const io = req.app.get("socketio");
            await updateOrderState(io, newOrderDoc[0]._id, "Pendiente");

            // Email
            await sendNotificationEmail(
                user.email,
                newOrderDoc[0]._id.toString(),
                '¡Hemos recibido tu pedido!',
                `
                  <p>Gracias por tu compra. Hemos recibido tu pedido con el ID <strong>${newOrderDoc[0]._id.toString().slice(-8)}</strong> y se encuentra actualmente en estado <strong>Pendiente</strong>.</p>
                  <p>En breve comenzaremos a prepararlo para su envío. Te notificaremos cualquier actualización sobre su estado.</p>
                  <p>Puedes revisar los detalles y el estado de tu pedido en tu cuenta.</p>
                  <p>Gracias por confiar en nosotros.<br/>— El equipo de ALEJANDR.IA</p>
                `,
                "Pendiente"
            );

            // Actualización automática de estado y notificación
            setTimeout(async () => {
                const updated = await updateOrderState(io, newOrderDoc[0]._id, "En Preparación");
                if (updated) {
                    const userEmail = user.email || "";
                    if (userEmail) {
                        await sendNotificationEmail(
                            userEmail,
                            newOrderDoc[0]._id.toString(),
                            '¡Estamos preparando tu pedido!',
                            `
                              <p>Tu pedido con el ID <strong>${newOrderDoc[0]._id.toString().slice(-8)}</strong> ya está en <strong>preparación</strong>.</p>
                              <p>Estamos alistando tus productos con cuidado para enviártelos lo antes posible. Te avisaremos en cuanto esté en camino.</p>
                              <p>Puedes hacer seguimiento al estado de tu pedido desde tu cuenta.</p>
                              <p>Gracias por tu confianza.<br/>— El equipo de ALEJANDR.IA</p>
                            `,
                            "En Preparación"
                        );
                    }
                }
            }, 15 * 1000);

        });

    } catch (error) {
        console.error(`Error: ${error}`);
        await session.abortTransaction();
        res.status(500).send(`Server error: ${error}`);
    } finally {
        session.endSession();
    }
};

async function restoreOrderBooksStock(orderId: string | mongoose.Types.ObjectId) {
    console.log(`Entrado a restoreOrderBooksStock`)
    const order = await orders.findById(orderId);
    if (!order) {
        console.log(`No se ha encontrado la orden: ${orderId}`)
        return
    }

    console.log(`order.state: ${order.state}`)
    if (!["Cancelado", "Devuelto"].includes(order.state)) return;

    for (const item of order.items) {
        const book = await books.findById(item.bookId)
        if (!book) {
            console.log(`No se encontró el libro ${item.bookId}`)
            return
        }
        console.log(`stock: ${book.stock} & cart quantity: ${item.quantity}`)
        book.stock += item.quantity
        await book.save()
    }
}

export const setCancelledOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const orderId = req.params.order;
        const io = req.app.get("socketio");

        // Actualiza el estado del pedido a Cancelado
        const updated = await updateOrderState(io, new Types.ObjectId(orderId), "Cancelado");

        if (updated === null) {
            res.status(400).send(`El pedido no se puede cancelar porque no está en "En Preparación"`);
            return;
        }
        if (!updated) {
            res.status(404).send("Pedido no encontrado o ya cancelado");
            return;
        }

        // ✅ Restaura el stock de los libros
        await restoreOrderBooksStock(orderId);

        res.status(200).json({ orderId, state: "Cancelado" });

        const userEmail = await getUserEmail(orderId);
        if (userEmail) {
            await sendNotificationEmail(
                userEmail,
                orderId,
                'Has cancelado tu pedido',
                `
                  <p>Hemos recibido tu solicitud y tu pedido con el ID <strong>${orderId.slice(-8)}</strong> ha sido <strong>cancelado</strong> exitosamente.</p>
                  <p>Gracias por informarnos. Si necesitas realizar un nuevo pedido o tienes alguna duda, estamos aquí para ayudarte.</p>
                  <p>Saludos cordiales,<br/>— El equipo de ALEJANDR.IA</p>
                `,
                "Cancelado"
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

        // ✅ Nuevo correo confirmando que el usuario solicitó la devolución
        await sendNotificationEmail(
            userEmail,
            orderId,
            'Has solicitado una devolución',
            `
                <p>Hemos recibido tu solicitud de devolución para el pedido <strong>${orderId.slice(-8)}</strong>.</p>
                <p>Tu pedido está ahora en proceso de <strong>devolución</strong>. Te notificaremos cuando se complete.</p>
                <p>Gracias por confiar en nosotros.</p>
                <p>Saludos cordiales,<br/>— El equipo de ALEJANDR.IA</p>
            `,
            "En Devolución"
        );

        // ⏳ Transición posterior automática
        const transitions = [
            {
                state: "Devuelto",
                subject: "Tu devolución ha sido procesada",
                message: (id: string) => `
                    <p>La devolución de tu pedido <strong>${id.slice(-8)}</strong> se ha <strong>completado correctamente</strong>.</p>
                    <p>Gracias por seguir el proceso de forma adecuada. Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    <p>Saludos cordiales,<br/>— El equipo de ALEJANDR.IA</p>
                `,
                delay: 30 * 1000,
                emailState: "Devuelto",
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

        // ⏳ Transiciones automáticas con correos mejorados
        const transitions = [
            {
                state: "En Tránsito",
                subject: "Tu pedido está en camino",
                message: (id: string) => `
                    <p>Tu pedido <strong>${id.slice(-8)}</strong> ya ha salido de nuestras instalaciones y está <strong>en tránsito</strong>.</p>
                    <p>Pronto lo recibirás en la dirección indicada. Te avisaremos una vez haya sido entregado.</p>
                    <p>Gracias por tu compra.<br/>— El equipo de ALEJANDR.IA</p>
                `,
                delay: 30 * 1000,
                emailState: "En Tránsito"
            },
            {
                state: "Entregado",
                subject: "Tu pedido ha sido entregado",
                message: (id: string) => `
                    <p>Nos alegra informarte que tu pedido <strong>${id.slice(-8)}</strong> ha sido <strong>entregado</strong> correctamente.</p>
                    <p>Esperamos que disfrutes de tu compra. Si tienes alguna duda o necesitas ayuda, estamos para ayudarte.</p>
                    <p>Gracias por confiar en nosotros.<br/>— El equipo de ALEJANDR.IA</p>
                `,
                delay: 30 * 1000,
                emailState: "Entregado"
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
