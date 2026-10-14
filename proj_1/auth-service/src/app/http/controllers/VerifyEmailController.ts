import { UserService } from "@/services/UserServices";

export async function verifyUserEmailController(props: {
    otpCode: string,
    email: string
}) {
    try {
        const { otpCode, email } = props;
        const userService = UserService.getInstance()
        const userExist = await userService.findUserByEmail(email);

        if (userExist) {
            const existingOtpCode = userExist.otpCode;

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