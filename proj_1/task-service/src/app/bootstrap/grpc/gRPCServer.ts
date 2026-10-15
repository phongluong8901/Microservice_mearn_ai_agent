import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import crypto from "crypto";
import path from "path";
import { PORT } from "../../..";
import { graph } from "@/graph";

// 1. Xác định đường dẫn tuyệt đối tới file cấu hình gRPC (.proto)
export const PROTO_PATH = path.join("/app", "proto");

// 2. Đọc và phân tích file .proto đồng bộ (loadSync)
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,  // Giữ nguyên kiểu viết tên biến (snake_case hoặc camelCase)
    longs: String,   // Chuyển kiểu dữ liệu long thành String để tránh tràn số trong JS
    enums: String,   // Chuyển enum thành dạng String
    defaults: true,  // Điền giá trị mặc định cho các trường trống
    oneofs: true,    // Hỗ trợ trường hợp oneof trong proto
});

// 3. Chuyển đổi package definition thành object gRPC có thể sử dụng được
const grpcObject = grpc.loadPackageDefinition(packageDefinition) as any;

// 4. Trỏ vào namespace 'tasks'
const taskProto = grpcObject.tasks;
const chatProto = grpcObject.chat;

// 5. Hàm phụ trợ tạo ngẫu nhiên một Task (mô phỏng dữ liệu)
function randomTask() {
    const titles = [
        "Write blog post",
        "Build gRPC system",
        "Learn Docker",
        "Deploy microservices",
        "Fix bugs",
        "Study system design",
        "Read architecture docs",
        "Improve backend API",
        "Optimize database",
        "Refactor services"
    ];

    return {
        id: crypto.randomUUID(), // Tạo một ID định danh ngẫu nhiên chuẩn UUID
        title: titles[Math.floor(Math.random() * titles.length)], // Lấy ngẫu nhiên tiêu đề trong mảng
        completed: Math.random() < 0.5 // Trạng thái hoàn thành ngẫu nhiên (true hoặc false)
    };
}

// 6. Hàm xử lý logic (Handler) cho RPC method `GetTasks`
async function GetTasks(call: any, callback: any) {
    try {
        // Tạo một mảng gồm 5 task ngẫu nhiên sử dụng hàm randomTask ở trên
        const generateTasks = Array.from({ length: 5 }, randomTask);

        // Trả kết quả về cho Client qua callback:
        // Tham số 1: error (null nếu không có lỗi)
        // Tham số 2: response object khớp với message `TaskList` trong file proto
        callback(null, {
            tasks: generateTasks,
        });
    } catch (err) {
        callback(err, null);
    }
}

async function Chat(call: grpc.ServerWritableStream<any, any>) {
    const { userId, message } = call.request;

    const graphStream = await graph.stream(
        {
            messages: [{ role: "user", ontent: message }],
            userId
        },
        {
            subgraphs: "custom",
            recursionLimit: 400,
            configurable: {
                userId
            }
        }
    );

    let inThingking = false;

    for await (const [, chunk] of graphStream) {
        const content = (chunk as any).content;
        if (!content) continue;

        const parts = content.split(/(<think>|<think>)/);
        for (const part of parts) {
            if (part === "<think>") {
                inThinking = false;
                continue;
            }
            if (!part) continue;

            call.write({
                type: inThingking ? "THINKING" : "CONTENT",
                content: part
            });
        }
    }

    call.write({
        type: "DONE",
        content: ""
    });
    call.end();
}

// 7. Hàm chính để khởi tạo và chạy gRPC Server
export function gRPCServer(portParam?: number) {
    // Khởi tạo một instance server gRPC mới
    const server = new grpc.Server();

    // Đăng ký dịch vụ TaskService và gán hàm GetTasks làm bộ xử lý (handler)
    server.addService(taskProto.TaskService.service, {
        GetTasks,
    });

    server.addService(chatProto.ChatService.service, {
        Chat
    })

    const bindPort = portParam || PORT || Number(process.env.PORT) || 50051;

    // Bind server vào địa chỉ IP (0.0.0.0 nghĩa là lắng nghe mọi interface) và cổng
    server.bindAsync(
        `0.0.0.0:${bindPort}`,
        grpc.ServerCredentials.createInsecure(), // Không dùng chứng chỉ bảo mật (dùng cho môi trường phát triển local)
        (error, port) => {
            if (error) {
                console.error(`Server failed to bind: ${error.message}`);
                return;
            }
            console.log(`gRPC task server running at port: ${port}`);

        }
    );
}