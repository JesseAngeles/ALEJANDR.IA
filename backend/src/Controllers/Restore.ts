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

        const user = await users.findOne({ email });
        if (!user) {
            res.status(404).send(`User not found`);
            return;
        }

        const restoreToken = await tokens.findOne({ token });
        if (!restoreToken) {
            res.status(404).send(`Token not found, maybe expired?`);
            return;
        }

        user.password = newPassword;
        const updatedUser = await user.save();

        res.status(200).json(returnUser(updatedUser));
    } catch (error) {
        res.status(500).send(`Server error: ${error}`);
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
            res.status(500).send("Email config missing");
            return;
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"ALEJANDR.IA" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Recupera el acceso a tu cuenta | ALEJANDR.IA",
            html: `
            <div style="font-family:'Segoe UI', Arial, sans-serif; background:#f9f9f9; padding:38px 0;">
                <div style="max-width: 480px; margin:auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow: 0 3px 12px rgba(0,0,0,0.07);">
                    <h2 style="text-align:center; color:#820000; margin-bottom:0.7em; margin-top:2em;">
                        Recupera el acceso a tu cuenta
                    </h2>
                    <div style="padding:0 36px 18px 36px;">
                        <p style="color:#444; font-size:1.08em;">
                            Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>ALEJANDR.IA</strong>.
                        </p>
                        <p style="color:#444; font-size:1.10em; margin:1.5em 0; text-align:center;">
                            <span style="display:inline-block; background:#f5eded; color:#820000; border-radius:8px; padding:15px 38px; font-size:1.3em; font-weight:600; letter-spacing:2px;">
                                ${token}
                            </span>
                        </p>
                        <p style="color:#444; font-size:1.02em;">
                            Ingresa este código en la pantalla de recuperación para crear una nueva contraseña. Este código es válido por <strong>15 minutos</strong>.
                        </p>
                        <p style="color:#999; font-size:0.95em; margin:1.5em 0 0 0;">
                            <strong>¿No solicitaste este cambio?</strong><br>
                            Ignora este mensaje y tu contraseña seguirá siendo la misma.
                        </p>
                        <div style="text-align:center; margin:2em 0 1em 0;">
                            <a href="${process.env.SERVER_URL || 'http://localhost:5173'}/password-recovery" 
                                target="_blank"
                                style="background:#820000; color:#fff; padding:12px 32px; border-radius:6px; text-decoration:none; font-size:1em; font-weight:600;">
                                Recuperar mi cuenta
                            </a>
                        </div>
                        <p style="color:#999; font-size:0.93em; text-align:center;">
                            Si tienes dudas, contáctanos:<br>
                            <a href="mailto:${process.env.EMAIL_USER}" style="color: #820000;">${process.env.EMAIL_USER}</a>
                        </p>
                    </div>
                </div>
            </div>
            `
        });

        res.status(200).json({ message: "Restore token sent to your email." });

    } catch (error) {
        res.status(500).send(`Server error: ${error}`);
    }
};
