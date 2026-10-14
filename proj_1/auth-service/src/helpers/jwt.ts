import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

// Hàm phụ trợ nội bộ tạo cấu trúc payload chuẩn chứa thông tin định danh cho token
function jwtPayload(userId: Types.ObjectId) {
    const payload = {
        iss: "auth-service", // Issuer (Đơn vị phát hành): Chỉ định rằng token này được phát hành bởi dịch vụ auth-service
        sub: userId, // Subject (Đối tượng): Định danh người dùng thông qua ID của họ
        aud: "gateway-service", // Audience (Khán giả): Chỉ định rằng token này dành cho gateway-service sử dụng
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // Thời gian hết hạn của token (tính bằng giây)
        iat: Math.floor(Date.now() / 1000), // Issued at: Thời điểm token được phát hành (tính bằng giây)
    };
    return payload;
}

// Hàm xuất ra dùng để ký và tạo Access Token ngắn hạn
export function signAccessToken(userId: Types.ObjectId) {
    // Lấy payload chuẩn dựa trên ID người dùng
    const payload = jwtPayload(userId);
    // Lấy khóa bí mật (secret key) dùng để ký Access Token từ biến môi trường
    const key = process.env.JWT_TOKEN_KEY as string;

    // Trả về một Promise bọc hàm callback bất đồng bộ của jwt.sign
    return new Promise((resolve, reject) => {
        // Thực hiện ký token bằng thuật toán mặc định với payload và key
        jwt.sign(payload, key, (error: Error | null, token: string | undefined) => {
            if (error) {
                return reject(error);
            }
            resolve(token); // Trả về chuỗi token đã được ký thành công
        });
    });
}

// Hàm xuất ra dùng để ký và tạo Refresh Token dài hạn
export function signRefreshToken(userId: Types.ObjectId) {
    const payload = jwtPayload(userId);
    const key = process.env.REFRESH_TOKEN_KEY as string;

    return new Promise((resolve, reject) => {
        jwt.sign(payload, key, (error: Error | null, token: string | undefined) => {
            if (error) {
                return reject(error);
            }
            resolve(token); // Trả về chuỗi Refresh Token thành công
        });
    });
}

// Middleware Express dùng để xác thực Access Token từ header HTTP
export function VerifyExpressToken(req: Request, res: Response, next: NextFunction) {
    try {
        // Lấy giá trị của trường Authorization từ HTTP headers gửi lên từ client
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        // Tách chuỗi để lấy phần token thực tế phía sau từ khóa "Bearer"
        const accessToken = authHeader.split(" ")[1];
        // Lấy khóa bí mật giải mã tương ứng với Access Token
        const key = process.env.JWT_TOKEN_KEY as string;

        // Tiến hành xác thực tính hợp lệ của token dựa trên chữ ký và khóa bí mật
        jwt.verify(accessToken, key, (error: any, payload: any) => {
            if (error) {
                // Trả về response trực tiếp thay vì throw error trong callback
                return res.status(401).send({ message: "Unauthorized" });
            }

            // Bạn có thể gắn payload vào req nếu sau này cần dùng thông tin user ở route tiếp theo
            // (req as any).user = payload; 

            next();
        });
    } catch (error) {
        return res.status(401).send({ message: "Unauthorized" });
    }
}