import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { response } from "express"; // (Lưu ý: Biến import này không dùng đến trong file này, bạn có thể xóa đi cho gọn)
import path from "path";
import { PROTO_PATH } from "./gRPCServer";



// 2. Đọc và phân tích file .proto đồng bộ (loadSync mặc định không có option nên cần đảm bảo tương thích kiểu dữ liệu nếu cần)
const packageDefinition = protoLoader.loadSync(PROTO_PATH);

// 3. Trỏ vào đúng namespace 'tasks' (khớp với `package tasks;` trong file .proto)
const proto = grpc.loadPackageDefinition(packageDefinition).tasks as any;

// 4. Khởi tạo một gRPC Client kết nối tới gRPC Server đang chạy ở cổng 50051 (không dùng bảo mật)
const client = new proto.TaskService(
    "localhost:50051",
    grpc.credentials.createInsecure()
);

// 5. Định nghĩa và xuất hàm allTask dùng Promise để bọc callback gRPC thành bất đồng bộ hiện đại
export function allTask() {
    return new Promise((resolve, reject) => {
        // Gọi phương thức GetTasks của gRPC server, truyền vào object rỗng {} tương ứng với message Empty
        client.GetTasks({}, (err: any, response: any) => {
            if (err) {
                console.error(err);
                reject(err); // Nên dùng reject(err) thay vì chỉ console.error để tầng gọi bên ngoài bắt được lỗi nếu cần
                return;
            }
            resolve(response); // Trả về kết quả (danh sách tasks) cho nơi gọi hàm khi thành công
        });
    });
}