import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    name?: string;
    email: string;
    isValidEmail: number;
    otpCode: string;
    password: string;
    createAt: Date;
    updatedAt: Date;
}

export enum USER_EMAIL_TYPE {
    INVALID_EMAIL = 0,
    VALID_EMAIL = 1
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true,
    },
    isValidEmail: {
        type: Number,
        default: 0,
        required: true,
    },
    otpCode: {
        type: String,
        required: true,
        default: ""
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const User = model<IUser>("User", userSchema)

export default User