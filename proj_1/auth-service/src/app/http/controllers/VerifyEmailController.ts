import { UserService } from "@/services/UserServices";

// Khai báo hàm bất đồng bộ xử lý nghiệp vụ xác thực email, nhận vào đối tượng chứa mã OTP và email
export async function verifyUserEmailController(props: {
    otpCode: string,
    email: string
}) {
    try {
        const { otpCode, email } = props;
        // Lấy thể hiện duy nhất (Singleton instance) của UserService
        const userService = UserService.getInstance()
        // Tìm kiếm user thông qua email
        const userExist = await userService.findUserByEmail(email);

        if (userExist) {
            const existingOtpCode = userExist.otpCode;

            // Kiểm tra so khớp mã OTP
            if (existingOtpCode === otpCode || parseInt(existingOtpCode) === parseInt(otpCode)) {
                await userService.validateUserEmail(email);
                return {
                    message: "Email verified successfully",
                    success: true
                };
            } else {
                return {
                    message: "Invalid OTP code",
                    success: false
                };
            }
        } else {
            return {
                message: "User not found",
                success: false
            };
        }
    } catch (error) {
        throw error
    }
}