import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../Interfaces/JwtPayload";

export const refreshAccessToken = (req: Request, res: Response): void => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        res.status(401).json({ message: "No refresh token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET!
        ) as JwtPayload;

        const newAccessToken = jwt.sign(
            {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role
            },
            process.env.JWT_SECRET!,
            { expiresIn: "15m" }
        );

        res.status(200).json({ token: newAccessToken });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};
