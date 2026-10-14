import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

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