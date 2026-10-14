import { Express } from "express";
import { expressServer } from "./express/expressServer";
import { gRPCServer } from "./grpc/gRPCServer";
import { dbConnection } from "./mongodb";
import { connectRabbitMQ } from "./rabbitmq";

export async function bootStrapApp(app: Express, PORT: number) {
    // Dòng gọi chạy HTTP Express Server
    // expressServer(app, PORT)

    //connect DB
    await dbConnection()

    // connect RabbitMQ
    await connectRabbitMQ()

    // Gọi hàm khởi chạy gRPC Server để lắng nghe kết nối từ client
    gRPCServer(PORT)
}