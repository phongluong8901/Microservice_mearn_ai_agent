import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
    name?: string;
    email: string;
    isValidEmail: number; // Thuộc tính trạng thái xác thực email dạng số (0 hoặc 1)
    otpCode: string; // Thuộc tính lưu mã OTP dùng để xác thực email
    password: string;
    createAt: Date;
    updatedAt: Date;
}

// Khai báo một enum để định nghĩa các hằng số trạng thái email
export enum USER_EMAIL_TYPE {
    INVALID_EMAIL = 0,
    VALID_EMAIL = 1
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        trim: true, // Tự động cắt bỏ khoảng trắng thừa ở đầu và cuối chuỗi
        default: null
    },
    email: {
        type: String,
        lowercase: true, // Tự động chuyển đổi toàn bộ ký tự thành chữ thường trước khi lưu
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
        default: "" // Giá trị mặc định là chuỗi rỗng
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Tự động kích hoạt tính năng quản lý thời gian (tạo createdAt và cập nhật updatedAt)
})

const User = model<IUser>("User", userSchema)

export default User