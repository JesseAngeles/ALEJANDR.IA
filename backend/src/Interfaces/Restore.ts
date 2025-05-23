import mongoose from "mongoose";
import { Document } from "mongoose";

export interface IRestoreToken extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    token: string,
    createdAt: Date,
    expiresAt: Date,
}
