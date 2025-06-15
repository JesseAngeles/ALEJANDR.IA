import { Request, Response } from "express"
import users from "../Models/User"
import { generateJWT } from "../Middleware/jwt"
import { returnUser, returnFullUser } from "../Middleware/ReturnFunctions"
import Collection from "../Models/Collection"
import { updateUserRecommendations } from "../Middleware/UpdateRecommendations"
import { sendNow } from "../Middleware/Mailer";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        const user = await users.findOne({ email })

        if (!user || !user.active) {
            res.status(403).send('La cuenta no esta verificada')
            return
        }

        if (!await user.comparePassword(password)) {
            res.status(404).send('Correo o contraseña incorrectas')
            return
        }

        const { token, payload } = generateJWT(user)

        res.status(200).json({ token, user: payload })
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Error del servidor: ${error}`)
    }
}


export const getCachedRecommendations = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        let user = await users.findById(userId);

        if (!user) {
            res.status(404).send("Usuario no encontrado");
            return;
        }

        // Si no tiene recomendaciones, generarlas
        if (!user.recommendations || user.recommendations.length === 0) {
            await updateUserRecommendations(userId);
            user = await users.findById(userId);

            if (!user) {
                res.status(500).send("Error al recargar usuario tras actualizar recomendaciones");
                return;
            }
        }

        res.status(200).json(user.recommendations || []);
    } catch (error) {
        console.error("❌ Error al obtener recomendaciones cacheadas:", error);
        res.status(500).send(`Error del servidor: ${error}`);
    }
};


const getServerUrl = () =>
    process.env.SERVER_URL && process.env.SERVER_URL.trim() !== ""
        ? process.env.SERVER_URL
        : "http://localhost:5173";

function getWelcomeEmailHtml(name: string, email: string) {
    const serverUrl = getServerUrl();
    const loginUrl = `${serverUrl}/login`;
    const verifyUrl = `${serverUrl}/verify-account?email=${email}`;

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
                            Tu cuenta ha sido creada exitosamente en nuestra plataforma, pero es necesario activar tu cuenta para empezar a disfrutar de todas las funciones de ALEJANDR.IA, por favor, verifica tu cuenta haciendo clic en el botón siguiente:
                        </p>
                        <div style="text-align:center; margin-top: 28px; margin-bottom: 18px;">
                            <a href="${verifyUrl}" target="_blank"
                                style="background-color: #830000; color: #fff; padding: 13px 32px; border-radius: 6px; text-decoration: none; font-size: 1em; font-weight: 600; display: inline-block;">
                                Verificar cuenta
                            </a>
                        </div>
                        <p style="color: #444; font-size: 1.05em; font-family: 'Inter', Arial, sans-serif;">
                            Una vez verificada tu cuenta, podrás acceder con tus credenciales y empezar a disfrutar de todas las funciones de ALEJANDR.IA.
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
                            ¡Gracias por unirte a ALEJANDR.IA!
                        </p>
                    </div>
                </div>
            </div>
            `;
}

function getPasswordChangedEmailHtml(name?: string) {
    return `
    <div style="font-family: 'Inter', Arial, sans-serif; background: #FFFFFF; padding: 40px 0;">
        <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 3px 12px rgba(0,0,0,0.07);">
            <h2 style="text-align:center; color: #830000; font-family: 'Cardo', serif; margin-bottom: 0.6em; margin-top: 2em;">
                Contraseña actualizada
            </h2>
            <div style="padding: 0 38px 18px 38px;">
                <p style="color: #007B83; font-size: 1.12em; margin-bottom: 1.2em; font-family: 'Inter', Arial, sans-serif;">
                    ¡Hola${name ? " " + name : ""}!
                </p>
                <p style="color: #444; font-size: 1.04em; font-family: 'Inter', Arial, sans-serif;">
                    Te informamos que la contraseña de tu cuenta en <strong>ALEJANDR.IA</strong> se ha cambiado correctamente.<br>
                    Si tú realizaste este cambio, no es necesario hacer nada más.<br>
                    <b>Si no fuiste tú</b>, por favor restablece tu contraseña cuanto antes y contacta al soporte.
                </p>
                <p style="color: #999; font-size: 0.92em; text-align:center; margin-top:18px;">
                    ¿Tienes dudas o problemas?<br>
                    <a href="mailto:${process.env.EMAIL_USER}" style="color: #830000;">${process.env.EMAIL_USER}</a>
                </p>
            </div>
        </div>
    </div>
    `;
}

export const addUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = req.body;
        user.directions = [];
        user.cards = [];
        user.cart = {};
        user.active = false;
        user.orders = [];

        const seeLaterCollection = new Collection({ name: "Ver más tarde" });
        user.collections = [seeLaterCollection];

        const newUser = new users(user);
        const addUser = await newUser.save();

        // ENVÍA EL CORREO DE BIENVENIDA
        if (addUser.email) {
            await sendNow(
                addUser.email,
                "¡Bienvenido/a a ALEJANDR.IA!",
                getWelcomeEmailHtml(addUser.name || "", addUser.email)
            );
        }

        res.status(200).json(returnUser(addUser));
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send(`Unauthorized: No user find in token`)
            return
        }

        const userId = req.user.id
        const user = await users.findById(userId)

        if (!user) {
            res.status(404).send("User not found")
            return
        }

        res.status(200).json(returnFullUser(user))
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const updateUserPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send("Unauthorized: No user found in token");
            return;
        }

        const id: string = req.user.id;
        const { password, newPassword } = req.body;

        if (!password || !newPassword) {
            res.status(400).send("Missing required fields");
            return;
        }

        if (password == newPassword) {
            res.status(400).send("Same old and new password");
            return;
        }

        const user: any = await users.findById(id);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            res.status(401).send("Incorrect old password");
            return;
        }

        user.password = newPassword;
        const updatedUser = await user.save();

        // ENVÍA EL CORREO DE CONFIRMACIÓN
        if (user.email) {
            await sendNow(
                user.email,
                "Tu contraseña ha sido cambiada",
                getPasswordChangedEmailHtml(user.name)
            );
        }

        res.status(200).json(returnUser(updatedUser));
    } catch (error) {
        console.error(`Error (Controllers/user/update): ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send("Unauthorized: No user found in token");
            return;
        }

        const id: string = req.user.id;
        const { name, email, password } = req.body;

        // Validaciones mínimas
        if (!password || !name || !email) {
            res.status(400).send("Missing required fields");
            return;
        }

        const user: any = await users.findById(id);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        // Validar contraseña ingresada
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            res.status(401).send("Incorrect password");
            return;
        }

        // Actualizar solo los campos permitidos
        user.name = name;
        user.email = email;

        const updatedUser = await user.save();

        res.status(200).json(returnUser(updatedUser));
    } catch (error) {
        console.error(`Error (Controllers/user/update): ${error}`);
        res.status(500).send(`Server error: ${error}`);
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).send(`Unauthorized: No user find in token`)
            return
        }

        const id: string = req.user.id

        const user = await users.findById(id)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        await users.findByIdAndDelete(id)

        res.status(200).json(returnUser(user))
    } catch (error) {
        console.error(`Error (Controllers/user/drop): ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}


//! **********FUNCIONES DE PRUEBA**********

//! Función para la generación de datos de prueba
export const multipleUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const usersData = req.body
        const savedUsers = []

        for (const userData of usersData) {
            userData.directions = []
            userData.cards = []
            userData.cart = {}
            userData.active = true
            userData.orders = []

            const seeLaterCollection = new Collection({ name: "Ver más tarde" })
            userData.collections = [seeLaterCollection]

            const newUser = new users(userData)
            const savedUser = await newUser.save()
            savedUsers.push(savedUser)
        }

        res.status(200).json(savedUsers)
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

//! Función para realizar pruebas sobre la consulta de usuarios
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const allUsers = await users.find()

        res.status(200).send(allUsers)

    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

//! Función de prueba para obtener a cualquier usuario por su ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: String = req.params.id

        const user = await users.findById(id)
        if (!user) {
            res.status(404).send(`User not found`)
            return
        }

        res.status(200).json(returnFullUser(user))
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(500).send(`Server error: ${error}`)
    }
}

export const getUserFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;

        const user = await users.findById(userId).populate({
            path: "collections.books",
            model: "Book"
        });

        if (!user) {
            res.status(404).send("Usuario no encontrado");
            return;
        }
        await updateUserRecommendations(userId);
        console.log("🧩 Colecciones del usuario:", user.collections);

        const favoritesCollection = user.collections.find(
            (col: any) => col.name === "favoritos" && col.books
        );

        if (!favoritesCollection || !favoritesCollection.books) {
            res.status(404).json({ message: "No se encontró la colección de favoritos." });
            return;
        }

        res.status(200).json(favoritesCollection.books);

    } catch (error) {
        console.error("❌ Error al obtener favoritos:", error);
        res.status(500).send(`Error del servidor: ${error}`);
    }
};
