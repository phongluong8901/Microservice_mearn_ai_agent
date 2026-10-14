import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { Request, Response, NextFunction } from "express";

const PROTO_PATH = path.join("/app", "proto", "auth.proto");

// 2. Đọc và phân tích file .proto đồng bộ (loadSync)
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

// 3. Trỏ vào đúng namespace 'auth' (khớp với `package auth;` trong file .proto)
const proto = grpc.loadPackageDefinition(packageDefinition).auth as any;

// 4. Khởi tạo một gRPC Client kết nối tới gRPC Server đang chạy ở cổng 50053 (không dùng bảo mật)
const gRPCAuthClient = new proto.AuthService(
    "auth-service:50053",
    grpc.credentials.createInsecure()
);

export function registerUsergRPC(req: Request, res: Response, next: NextFunction) {
    try {
        const fn = gRPCAuthClient.registerUser || gRPCAuthClient.RegisterUser;
        fn.call(gRPCAuthClient, {
            email: req.body?.email,
            password: req.body?.password,
        }, (err: any, response: any) => {
            if (err) {
                return res.status(400).json({
                    message: err.details || err.message
                });
            }

            return res.json(response);
        });
    } catch (error) {
        next(error)
    }
}

export function verifyUserEmailgRPC(req: Request, res: Response, next: NextFunction) {
    try {
        const fn = gRPCAuthClient.verifyUserEmail || gRPCAuthClient.VerifyUserEmail;
        fn.call(gRPCAuthClient, {
            email: req.body?.email,
            otpCode: String(req.body?.otpCode || ""),
        }, (err: any, response: any) => {
            if (err) {
                return res.status(400).json({
                    message: err.details || err.message
                });
            }

            return res.json(response);
        });
    } catch (error) {
        next(error)
    }
}

export function loginUsergRPC(req: Request, res: Response, next: NextFunction) {
    try {
        const fn = gRPCAuthClient.loginUser || gRPCAuthClient.LoginUser;
        fn.call(gRPCAuthClient, {
            email: req.body?.email,
            password: req.body?.password,
        }, (err: any, response: any) => {
            if (err) {
                return res.status(400).json({
                    message: err.details || err.message
                });
            }

            return res.json(response);
        });
    } catch (error) {
        next(error)
    }
}