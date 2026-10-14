import { IUser } from "@/models/UserSchema";
import { signAccessToken, signRefreshToken } from "./jwt"

// Khai báo hàm bất đồng bộ nhận vào thông tin đối tượng user để chuẩn bị dữ liệu trả về khi đăng nhập/đăng ký thành công
export async function authData(user: IUser) {
    // Chuyển đổi Mongoose document thành đối tượng JS thuần, đồng thời tách riêng trường mật khẩu (password) ra để bảo mật và giữ lại các thuộc tính còn lại (restProps)
    const { password, ...restProps } = user.toObject()

    // Thực thi song song việc ký cả 2 loại token để tiết kiệm thời gian chờ đợi
    const [accessToken, refreshToken] = await Promise.all([
        signAccessToken(user?._id), // Tạo Access Token ngắn hạn dựa trên ID của user
        signRefreshToken(user?._id) // Tạo Refresh Token dài hạn dựa trên ID của user
    ])

    // Khởi tạo cấu trúc đối tượng dữ liệu tổng hợp khớp với định nghĩa UserData trong file proto
    const data = {
        token: {
            accessToken: String(accessToken || ""),
            refreshToken: String(refreshToken || "")
        },
        user: {
            ...restProps, // Kế thừa các thuộc tính còn lại từ đối tượng user
            _id: user._id.toString(),
            name: restProps.name || ""
        },
        isLoggedIn: true
    }

    console.log('rest props: ', restProps)

    return data
}