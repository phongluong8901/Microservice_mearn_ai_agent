import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import crypto from "crypto";
import path from "path";
import { PORT } from "../../..";
import { registerUserController } from "@/app/http/controllers/registerUserController";

// 1. Xác định đường dẫn tuyệt đối tới file cấu hình gRPC (.proto)
export const PROTO_PATH = path.join("/app", "proto", "auth.proto");

// 2. Đọc và phân tích file .proto đồng bộ (loadSync)
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,  // Giữ nguyên kiểu viết tên biến (snake_case hoặc camelCase)
    longs: String,   // Chuyển kiểu dữ liệu long thành String để tránh tràn số trong JS
    enums: String,   // Chuyển enum thành dạng String
    defaults: true,  // Điền giá trị mặc định cho các trường trống
    oneofs: true,    // Hỗ trợ trường hợp oneof trong proto
});

// 3. Chuyển đổi package definition thành object gRPC có thể sử dụng được
const proto = grpc.loadPackageDefinition(packageDefinition) as any;

// 4. Trỏ vào namespace 'tasks'
const auth = proto.auth;

async function registerUser(call: any, callback: any) {
    try {
        const response = await registerUserController({
            email: call?.request?.email,
            password: call?.request?.password
        });

        callback(null, response)
    } catch (error) {
        callback({
            code: grpc.status.INVALID_ARGUMENT,
            message: (error as Error).message || "Registration failed"
        },
            null)
    }
}

// 7. Hàm chính để khởi tạo và chạy gRPC Server
export function gRPCServer(portParam?: number) {
    // Khởi tạo một instance server gRPC mới
    const server = new grpc.Server();


    server.addService(auth.AuthService.service, {
        registerUser,
    });

    const bindPort = portParam || PORT || Number(process.env.PORT) || 50053;

    // Bind server vào địa chỉ IP (0.0.0.0 nghĩa là lắng nghe mọi interface) và cổng
    server.bindAsync(
        `0.0.0.0:${bindPort}`,
        grpc.ServerCredentials.createInsecure(), // Không dùng chứng chỉ bảo mật (dùng cho môi trường phát triển local)
        (error, port) => {
            if (error) {
                console.error(`Server failed to bind: ${error.message}`);
                return;
            }
            console.log(`gRPC Auth service running at port: ${port}`);

        }
    );
}