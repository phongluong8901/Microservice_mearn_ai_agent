import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import { Request, Response, NextFunction } from "express";

const PROTO_PATH = path.join("/app", "proto", "task.proto");

// 2. Đọc và phân tích file .proto đồng bộ (loadSync)
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

// 3. Trỏ vào đúng namespace 'tasks' (khớp với `package tasks;` trong file .proto)
const proto = grpc.loadPackageDefinition(packageDefinition).tasks as any;

// 4. Khởi tạo một gRPC Client kết nối tới gRPC Server đang chạy ở cổng 50051 (không dùng bảo mật)
const gRPCTaskClient = new proto.TaskService(
    "task-service:50051",
    grpc.credentials.createInsecure()
);

// Middleware/Controller Express xử lý yêu cầu đăng ký qua gRPC Client
export function getTaskgRPC(req: Request, res: Response, next: NextFunction) {
    try {
        const fn = gRPCTaskClient.getTasks || gRPCTaskClient.GetTasks;
        fn.call(gRPCTaskClient, {}, (err: any, response: any) => {
            if (err) {
                return res.status(500).json({
                    message: err.details || err.message
                })
            }

            return res.json(response)
        })
    } catch (error) {
        next(error)
    }
}
