import User, { IUser, USER_EMAIL_TYPE } from "../models/UserSchema";

// Khai báo lớp UserService chứa các phương thức
export class UserService {
    // Biến tĩnh lưu giữ thể hiện duy nhất của lớp (để áp dụng Singleton Pattern)
    private static instance: UserService;

    // Phương thức tĩnh công khai để lấy thể hiện duy nhất của UserService
    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(); // Tạo mới một đối tượng UserService và gán vào biến tĩnh
        }

        return UserService.instance; // Trả về thể hiện duy nhất của lớp
    }

    // Phương thức bất đồng bộ cập nhật lại mã OTP theo email
    async updateOtpCode(email: string, otpCode: string): Promise<void> {
        //để cập nhật bản ghi trong cơ sở dữ liệu
        await User.updateOne(
            { email }, // Điều kiện tìm kiếm bản ghi user cần cập nhật dựa vào email
            {
                $set: { // Sử dụng toán tử $set để thay đổi giá trị trường cụ thể
                    otpCode, // Cập nhật mã OTP mới
                }
            }
        );
    }

    // Phương thức bất đồng bộ đánh dấu email đã được xác thực thành công
    async validateUserEmail(email: string): Promise<void> {
        //để cập nhật trạng thái xác thực trong DB
        await User.updateOne(
            { email }, // Điều kiện tìm kiếm user theo email
            {
                $set: {
                    isValidEmail: USER_EMAIL_TYPE.VALID_EMAIL, // Đổi trạng thái isValidEmail thành đã xác thực (giá trị 1)
                }
            }
        );
    }

    // Phương thức tìm kiếm thông tin người dùng dựa vào email
    async findUserByEmail(email: string): Promise<IUser | null> {
        // Truy vấn bản ghi đầu tiên khớp với email, trả về kiểu IUser hoặc null nếu không tìm thấy
        return await User.findOne({ email });
    }

    // Phương thức bất đồng bộ xử lý đăng ký người dùng mới nhận vào một object tham số
    async registerUser(props: {
        email: string;
        otpCode: string;
        hashPwd: string;
    }): Promise<IUser> { // Trả về một Promise chứa thông tin đối tượng người dùng vừa tạo (kiểu IUser)

        // Kiểm tra xem email này đã tồn tại trong hệ thống hay chưa
        const existingUser = await this.findUserByEmail(props.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        // / Khởi tạo một đối tượng Mongoose Document mới với dữ liệu truyền vào
        const user = new User({
            email: props.email,
            isValidEmail: USER_EMAIL_TYPE.INVALID_EMAIL, // Đặt trạng thái ban đầu của email là chưa xác thực (0)
            otpCode: props.otpCode,
            password: props.hashPwd
        });

        // Lưu bản ghi người dùng mới này vào cơ sở dữ liệu MongoDB
        await user.save();

        return user;
    }

}