import mongoose, { Schema, Document } from "mongoose"
import bcrypt from "bcryptjs"
import { User } from "../Interfaces/User"

import { directionSchema } from "./Direction"
import { cardSchema } from "./Card"

interface UserDocument extends User, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    directions: [{
        type: directionSchema, 
        required: false
    }],
    cards: [{
        type: cardSchema,
        required: false
    }]
});

// Hashear la contraseña
userSchema.pre("save", async function (next) {
    const user = this as UserDocument;

    if (!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        console.log(`Error hashing password: ${error}`);
        next();
    }
});

// Comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password)
};

export default mongoose.model<UserDocument>("users", userSchema);
