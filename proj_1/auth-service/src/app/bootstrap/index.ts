import { Express } from "express";
import { expressServer } from "./express/expressServer";
import { gRPCServer } from "./grpc/gRpcServer";

export function bootStrapApp(app: Express, PORT: number) {
    // Dòng gọi chạy HTTP Express Server
    expressServer(app, PORT)

    // Gọi hàm khởi chạy gRPC Server để lắng nghe kết nối từ client
    gRPCServer()
}