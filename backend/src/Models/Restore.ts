import mongoose, { Schema } from "mongoose";
import { IRestoreToken } from "../Interfaces/Restore";

const restoreTokenSchema = new Schema<IRestoreToken>({
    userId: { type: Schema.Types.ObjectId, ref: "users1", required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
})

restoreTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRestoreToken>("tokens", restoreTokenSchema);
