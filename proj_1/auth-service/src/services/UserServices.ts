import User, { IUser, USER_EMAIL_TYPE } from "../models/UserSchema";

export class UserService {
    private static instance: UserService;

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    async updateOtpCode(email: string, otpCode: string): Promise<void> {
        await User.updateOne(
            { email },
            {
                $set: {
                    otpCode,
                }
            }
        );
    }

    async validateUserEmail(email: string): Promise<void> {
        await User.updateOne(
            { email },
            {
                $set: {
                    isValidEmail: USER_EMAIL_TYPE.VALID_EMAIL,
                }
            }
        );
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async registerUser(props: {
        email: string;
        otpCode: string;
        hashPwd: string;
    }): Promise<IUser> {
        const existingUser = await this.findUserByEmail(props.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        const user = new User({
            email: props.email,
            isValidEmail: USER_EMAIL_TYPE.INVALID_EMAIL,
            otpCode: props.otpCode,
            password: props.hashPwd
        });

        await user.save();

        return user;
    }

}