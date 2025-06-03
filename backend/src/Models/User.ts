import mongoose, { Schema, Document, Types } from "mongoose"
import bcrypt from "bcryptjs"
import { User, roles } from "../Interfaces/User"

import { directionSchema } from "./Direction"
import { cardSchema } from "./Card"
import { collectionSchema } from "./Collection"
import { cartSchema } from "./Cart"

interface UserDocument extends Omit<User, '_id'>, Document {
    _id: Types.ObjectId
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>({
    name: {
        type: Schema.Types.String,
        required: true
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true
    },
    active: {
        type: Schema.Types.Boolean,
        required: true
    },
    role: {
        type: Schema.Types.String,
        enum: Object.values(roles),
        required: true,
        default: roles.user
    },
    directions: {
        type: [directionSchema],
        required: false
    },
    cards: {
        type: [cardSchema],
        required: false
    },
    collections: {
        type: [collectionSchema],
        required: false
    },
    cart: {
        type: cartSchema,
        required: false
    },
    orders: {
        type: [Schema.Types.ObjectId],
        required: false
    },
    recommendations: {
        type: [Object],
        default: []
    }
})

userSchema.pre("save", async function (next) {
    const user = this as UserDocument;

    if (user.role === roles.admin && (user.directions?.length || user.cards?.length))
        return next(new Error("Admins do not have directions or cards"))

    if (!user.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        next()
    } catch (error) {
        console.log(`Error hashing password: ${error}`)
        next()
    }
})

// Comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password)
};

export default mongoose.model<UserDocument>("users1", userSchema);
