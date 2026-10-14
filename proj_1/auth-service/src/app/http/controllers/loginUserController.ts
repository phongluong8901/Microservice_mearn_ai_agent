import { userInputSchema } from "./UserDTO";
import z from "zod";
import { UserService } from "@/services/UserServices";
import { USER_EMAIL_TYPE } from "@/models/UserSchema";
import { comparePassword } from "@/helpers/userPassword";
import { authData } from "@/helpers/authData";

// Khai báo hàm bất đồng bộ xử lý nghiệp vụ đăng nhập nhận vào email và password
export async function loginUserController(props: { email: string, password: string }) {
    try {
        const { email, password } = props;
        // Kiểm tra tính hợp lệ của dữ liệu đầu vào theo Zod schema một cách an toàn
        const result = userInputSchema.safeParse({ email, password });

        if (!result.success) {
            throw {
                message: "Validation Failed",
                validationErrors: z.flattenError(result.error)
            }
        }

        const userService = UserService.getInstance(); // Lấy thể hiện duy nhất (Singleton instance) của UserService
        const user = await userService.findUserByEmail(email); // Tìm kiếm user thông qua email

        if (!user) {
            throw new Error("Invalid Email or Password");
        }

        if (user.isValidEmail !== USER_EMAIL_TYPE.VALID_EMAIL) {
            throw new Error("Please verify your email before logging in");
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa lưu trong DB
        const isMatch = await comparePassword(password, user.password);

        if (isMatch) {
            const userData = await authData(user);

            return {
                userData
            };
        } else {
            throw new Error("Invalid Email or Password");
        }
    } catch (error) {
        throw error;
    }
}