import { Request, Response } from "express"
import tokens from "../Models/Restore";
import users from "../Models/User";
import crypto from "crypto";
import { returnUser } from "../Middleware/ReturnFunctions";
import nodemailer from "nodemailer";

require('dotenv').config()

export const restorePassWithToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, token, newPassword } = req.body;

        const user = await users.findOne({ email })
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        const restoreToken = await tokens.findOne({ token })
        if (!restoreToken) {
            res.status(404).send(`Token not found, maybe expired?`)
            return
        }

        user.password = newPassword
        const updatedUser = await user.save()

        res.status(200).json(returnUser(updatedUser))
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
};

export const generateRestoreToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const user = await users.findOne({ email });

        if (!user) {
            res.status(404).send(`User not found`);
            return;
        }

        const token = crypto.randomBytes(4).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await tokens.create({
            userId: user._id,
            token,
            expiresAt,
        });



        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("❌ Faltan credenciales de correo");
             res.status(500).send("Email config missing");
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Código de recuperación",
            html: `<p>Tu código de recuperación es: <strong>${token}</strong></p>`,
        });

        console.log("✅ Email enviado a", email);
        res.status(200).json({ message: "Restore token sent to your email." });

    } catch (error) {
        console.error("❌ Error en generateRestoreToken:", error);
        res.status(500).send(`Server error: ${error}`);
    }
};
