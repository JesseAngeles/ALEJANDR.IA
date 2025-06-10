import { Request, Response } from "express";
import tokens from "../Models/Restore";
import users from "../Models/User";
import crypto from "crypto";
import { returnUser } from "../Middleware/ReturnFunctions";
import { sendNow } from "../Middleware/Mailer";

require('dotenv').config();

const getServerUrl = () =>
    process.env.SERVER_URL && process.env.SERVER_URL.trim() !== ""
        ? process.env.SERVER_URL
        : "http://localhost:5173";

function getRestoreEmailHtml(token: string) {
    const serverUrl = getServerUrl();
    return `
    <div style="font-family: 'Inter', Arial, sans-serif; background: #f7f8fa; padding: 40px 0;">
        <div style="max-width: 420px; margin: auto; background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
            <h2 style="text-align:center; color: #830000; font-family: 'Cardo', serif; margin-bottom: 1.1em; margin-top: 2em; letter-spacing: 0.5px;">
                Recupera tu acceso a ALEJANDR.IA
            </h2>
            <div style="padding: 0 34px 22px 34px;">
                <p style="color: #007B83; font-size: 1.08em; margin-bottom: 1.2em; text-align:center;">
                    Hemos recibido una solicitud para cambiar la contraseña de tu cuenta.
                </p>
                <p style="color: #444; font-size: 1.13em; margin: 2em 0; text-align:center;">
                    <span style="display:inline-block; background: #f5eded; color: #830000; border-radius: 8px; padding: 15px 38px; font-size: 1.38em; font-weight: 600; letter-spacing: 2px; font-family: 'Inter', Arial, sans-serif;">
                        ${token}
                    </span>
                </p>
                <p style="color: #444; font-size: 1em;">
                    Ingresa este código en la pantalla de recuperación. <b>El código es válido por 15 minutos.</b>
                </p>
                <p style="color: #999; font-size: 0.98em; margin-top: 2.5em;">
                    Si no solicitaste este cambio, ignora este mensaje. Tu cuenta seguirá segura.
                </p>
                <div style="text-align:center; margin: 2.3em 0 1.1em 0;">
                    <a href="${serverUrl}/password-recovery"
                        target="_blank"
                        style="background: #830000; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-size: 1em; font-weight: 600; letter-spacing: 0.5px;">
                        Recuperar mi cuenta
                    </a>
                </div>
                <p style="color: #999; font-size: 0.92em; text-align:center; margin-top: 28px;">
                    ¿Necesitas ayuda? <a href="mailto:${process.env.EMAIL_USER}" style="color:#007B83;">${process.env.EMAIL_USER}</a>
                </p>
            </div>
        </div>
    </div>
    `;
}

function getPasswordRestoredEmailHtml(name?: string) {
    const serverUrl = getServerUrl();
    const loginUrl = `${serverUrl}/login`;

    return `
    <div style="font-family: 'Inter', Arial, sans-serif; background: #FFFFFF; padding: 40px 0;">
        <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 3px 12px rgba(0,0,0,0.07);">
            <h2 style="text-align:center; color: #830000; font-family: 'Cardo', serif; margin-bottom: 0.6em; margin-top: 2em;">
                ALEJANDR.IA
            </h2>
            <div style="color: #007B83; font-size: 1.15em; margin-bottom: 1.1em; font-family: 'Inter', Arial, sans-serif; text-align:center;">
                ¡Tu contraseña ha sido cambiada!
            </div>
            <div style="padding: 0 38px 18px 38px;">
                <div style="color: #444; font-size: 1.05em; font-family: 'Inter', Arial, sans-serif;">
                    <p>
                        Hola${name ? " " + name : ""},<br><br>
                        Te confirmamos que la contraseña de tu cuenta en <strong>ALEJANDR.IA</strong> se ha cambiado correctamente.<br>
                        Si realizaste este cambio, no necesitas hacer nada más.<br>
                        <strong>¿No reconoces este cambio?</strong> Por tu seguridad, restablece tu contraseña cuanto antes y contáctanos.
                    </p>
                </div>
                <div style="text-align:center; margin-top: 28px; margin-bottom: 18px;">
                    <a href="${loginUrl}" target="_blank"
                        style="background-color: #830000; color: #fff; padding: 13px 32px; border-radius: 6px; text-decoration: none; font-size: 1em; font-weight: 600; display: inline-block;">
                        Iniciar sesión
                    </a>
                </div>
                <p style="color: #999; font-size: 0.92em; text-align:center; margin-top:18px;">
                    Si tienes dudas, contáctanos:<br>
                    <a href="mailto:${process.env.EMAIL_USER}" style="color: #830000;">${process.env.EMAIL_USER}</a><br>
                    Gracias por confiar en nosotros.
                </p>
            </div>
        </div>
    </div>
    `;
}

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

        // ENVÍA EL CORREO DE CONFIRMACIÓN DE CAMBIO
        if (user.email) {
            await sendNow(
                user.email,
                "Tu contraseña ha sido restablecida",
                getPasswordRestoredEmailHtml(user.name)
            );
        }

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

        // Enviar el correo usando la nueva interfaz y el nuevo estilo:
        await sendNow(
            email,
            "Recupera el acceso a tu cuenta | ALEJANDR.IA",
            getRestoreEmailHtml(token)
        );

        res.status(200).json({ message: "Restore token sent to your email." });

    } catch (error) {
        res.status(500).send(`Server error: ${error}`);
    }
};
