import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

function jwtPayload(userId: Types.ObjectId) {
    const payload = {
        iss: "auth-service",
        sub: userId,
        aud: "gateway-service",
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        iat: Math.floor(Date.now() / 1000),
    };
    return payload;
}

export function signAccessToken(userId: Types.ObjectId) {
    const payload = jwtPayload(userId);
    const key = process.env.JWT_TOKEN_KEY as string;
    return new Promise((resolve, reject) => {
        jwt.sign(payload, key, (error: Error | null, token: string | undefined) => {
            if (error) {
                return reject(error);
            }
            resolve(token);
        });
    });
}

export function signRefreshToken(userId: Types.ObjectId) {
    const payload = jwtPayload(userId);
    const key = process.env.REFRESH_TOKEN_KEY as string;

    return new Promise((resolve, reject) => {
        jwt.sign(payload, key, (error: Error | null, token: string | undefined) => {
            if (error) {
                return reject(error);
            }
            resolve(token);
        });
    });
}

export function VerifyExpressToken(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const accessToken = authHeader.split(" ")[1];
        const key = process.env.JWT_TOKEN_KEY as string;

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