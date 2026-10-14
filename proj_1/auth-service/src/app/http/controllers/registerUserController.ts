import { NextFunction, Response, Request } from "express";
import { userInputSchema } from "./UserDTO";
import { UserService } from "@/services/UserServices";
import z from "zod";
import { generateOTP } from "@/helpers/generateOTP";
import { hashPassword } from "../../../helpers/userPassword";
import { publishEvent } from "@/app/bootstrap/rabbitmq/events";

// Khai báo hàm bất đồng bộ xử lý nghiệp vụ đăng ký nhận vào một đối tượng chứa email và password
export async function registerUserController(props: {
    email: string;
    password: string;
}) {
    try {
        const { email, password } = props;

        // Thực hiện kiểm tra (validate) dữ liệu đầu vào dựa trên Zod schema một cách an toàn (không ném lỗi ngoại lệ trực tiếp)
        const result = userInputSchema.safeParse({ email, password });

        // Nếu dữ liệu không thỏa mãn các điều kiện trong schema
        if (!result.success) {
            throw {
                message: "Validation Failed",
                validationErrors: z.flattenError(result.error)
            }
        }

        // Lấy thể hiện duy nhất (Singleton instance) của UserService để tương tác với database
        const userRepo = UserService.getInstance();

        const otpCode = generateOTP(7) // Sinh một mã OTP bảo mật có độ dài 7 ký tự
        const hashPwd = await hashPassword(password) // Tiến hành băm (hash) mật khẩu thô

        // Gọi service để lưu thông tin người dùng mới vào MongoDB
        const user = await userRepo.registerUser({ email, otpCode, hashPwd })

        // Phát ra một sự kiện RabbitMQ với routing key là "user.created"
        publishEvent("user.created", {
            userId: user._id,
            email: user.email,
            otpCode
        });

        return {
            message: "We sent to your an email verify, use the code verify your email",
            user
        };
    } catch (error) {
        throw error;
    }
}

//---
// export async function registerUser(req: Request, res: Response, next: NextFunction) {
//     try {
//         const email = req.body?.email;
//         const password = req.body?.password;

//         const result = userInputSchema.safeParse({ email, password });

//         if (!result.success) {
//             return res.status(422).json({
//                 message: "Validation Failed",
//                 validationErrors: z.flattenError(result.error)
//             });
//         }

//         const userRepo = UserService.getInstance();

//         const otpCode = generateOTP(7)
//         const hashPwd = await hashPassword(password)

//         const user = await userRepo.registerUser({ email, otpCode, hashPwd })

//         publishEvent("user.created", {
//             userId: user._id,
//             email: user.email,
//             otpCode
//         });

//         return res.json({
//             message: "Your account was created successfully",
//             user
//         });
//     } catch (error) {
//         next(error);
//     }
// }