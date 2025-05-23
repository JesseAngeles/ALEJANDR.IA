import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

import { JwtPayload } from "../Interfaces/JwtPayload"

const JWT_SECRET: string = process.env.JWT_SECRET!
const EXPIRATION_JWT_TOKEN = "15d"


declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}

export const generateJWT = (user: any) => {
    const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: EXPIRATION_JWT_TOKEN
    })

    return { token, payload }
}

export const generateTokens = (user: any) => {
    const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    return { accessToken, refreshToken };
};


export const refreshToken = (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ message: "No refresh token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
        const newAccessToken = jwt.sign(decoded, JWT_SECRET, { expiresIn: "15m" });

        return res.json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        res.status(401).send("Token not given")
        return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
        req.user = decoded
        next()
    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(403).send("Invalid/expired token")
    }
}

export const authorizeRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = req.user

        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({ message: "Access denied" })
            return
        }

        return next()
    }
}
