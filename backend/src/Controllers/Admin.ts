import { sendNow } from "../Middleware/Mailer";
import { Request, Response } from "express";
import users from "../Models/User";
import { returnUser } from "../Middleware/ReturnFunctions";

const getServerUrl = () =>
    process.env.SERVER_URL && process.env.SERVER_URL.trim() !== ""
        ? process.env.SERVER_URL
        : "http://localhost:5173";

// Puedes mover este HTML a otro archivo utilitario si quieres reutilizarlo.
function getWelcomeEmailHtml(name: string) {
    const serverUrl = getServerUrl();
    const loginUrl = `${serverUrl}/login`;

    return `
    <div style="font-family: 'Inter', Arial, sans-serif; background: #FFFFFF; padding: 40px 0;">
        <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 3px 12px rgba(0,0,0,0.07);">
            <h2 style="text-align:center; color: #830000; font-family: 'Cardo', serif; margin-bottom: 0.6em; margin-top: 2em;">
                Bienvenido/a a ALEJANDR.IA
            </h2>
            <div style="padding: 0 38px 18px 38px;">
                <p style="color: #007B83; font-size: 1.12em; margin-bottom: 1.2em; font-family: 'Inter', Arial, sans-serif;">
                    ¡Hola${name ? " " + name : ""}!
                </p>
                <p style="color: #444; font-size: 1.05em; font-family: 'Inter', Arial, sans-serif;">
                    Tu cuenta ha sido creada exitosamente en nuestra plataforma. Ya puedes acceder con tus credenciales y empezar a disfrutar de las funciones de ALEJANDR.IA.
                </p>
                <div style="text-align:center; margin-top: 28px; margin-bottom: 18px;">
                    <a href="${loginUrl}" target="_blank"
                        style="background-color: #830000; color: #fff; padding: 13px 32px; border-radius: 6px; text-decoration: none; font-size: 1em; font-weight: 600; display: inline-block;">
                        Iniciar sesión
                    </a>
                </div>
                <p style="color: #999; font-size: 0.92em; text-align:center; margin-top:18px;">
                    Si tienes dudas, contáctanos:<br>
                    <a href="mailto:${process.env.EMAIL_USER}" style="color: #830000;">${process.env.EMAIL_USER}</a><br>
                    ¡Gracias por unirte al equipo!
                </p>
            </div>
        </div>
    </div>
    `;
}

export const addAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const admin = req.body;

        admin.password = "1234";
        admin.role = "admin";
        admin.active = true;

        const newUser = new users(admin);
        const addUser = await newUser.save();

        // ENVÍA EL CORREO DE BIENVENIDA
        if (admin.email) {
            await sendNow(
                admin.email,
                "¡Tu cuenta de administrador en ALEJANDR.IA ha sido creada!",
                getWelcomeEmailHtml(admin.name || "")
            );
        }

        res.status(200).json(addUser);
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const findRole = "user";
        const allUsers = await users.find({ role: findRole });

        res.status(200).send(allUsers.map(returnUser));
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};
