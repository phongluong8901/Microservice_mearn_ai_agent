# --- lib

# --- stack
1. cho file task.proto vao grpc postman
Việc bạn đưa file task.proto vào mục gRPC trong Postman đóng vai trò cốt lõi để Postman có thể giao tiếp được với gRPC Server của bạn.

Cung cấp "bản đồ" (Hợp đồng API): Khác với REST API (dùng JSON thuần qua HTTP/1.1), gRPC truyền dữ liệu dưới dạng nhị phân (binary / Protobuf) qua HTTP/2. Postman không thể tự hiểu các đoạn mã nhị phân này nếu không có file .proto làm từ điển giải mã.

Tự động tạo giao diện nhập liệu (Request Body): Khi bạn chọn file task.proto, Postman sẽ đọc cấu trúc message (ví dụ: message Empty) và tự động sinh ra khung JSON mẫu để bạn có thể điền dữ liệu gửi đi một cách trực quan mà không cần viết mã.

Giải mã (Decode) dữ liệu trả về: Khi gRPC Server của bạn trả về một cục dữ liệu nhị phân (danh sách các Task), Postman sẽ dựa vào file .proto để dịch ngược (deserialize) nó thành định dạng JSON rõ ràng, giúp bạn nhìn thấy ngay kết quả như thế này:

{
    "tasks": [
        {
            "id": "abc-123",
            "title": "Build gRPC system",
            "completed": true
        }
    ]
}

# --- more
🛠️ TECH STACK:
• TypeScript & Express.js
• MongoDB
• Redis for caching
• RabbitMQ for message queues
• Docker & Docker Compose
• LangChain & LangGraph for AI Ochestration



✅ API Gateway - Single entry point for all client requests
✅ Auth Service - User registration, login & JWT tokens (MongoDB)
✅ Notification  Service - For sending email
✅ Task Service - For Handling AI logic

---
client - api gateway (jwt gateway) - acount/users/customers (auth-service, rabbitmq, notification-service, mailtrap) - apigateway - task service

agent: sale/lead qualification/lead nurting/customer support

knowledge base: upload document, add quesion

---
Ai Agent system: memoryAgent, workerAgnet

self-host(pg-vector): vetoc database (longterm memory, knowledge base)

mongodb: user data, chat history, working memory, short-term memory, human in loop

redis: cache (working memory, short-term memory)

---
nodejs
grpc
docker
docker compose
mongoDB
redis
rabbitmq
ai ocherstation(langchain, langgraph)
vetor databases
RAG (embbeding, retievers, propmpt)
design memory agent
human in the loop (HITL)
React/tailwind

---
user -> nodejs(epress server + grpc server)

# --- workflow
1. gRPC
Bước 1: Khởi tạo và Biên dịch hợp đồng (.proto)
Cả Server và Client đều sử dụng thư viện @grpc/proto-loader để đọc file proto/task.proto thông qua hàm protoLoader.loadSync.

File .proto đóng vai trò như một bản hợp đồng (contract) định nghĩa rõ:

Server có dịch vụ nào (TaskService).

Phương thức nào được gọi (GetTasks).

Dữ liệu gửi đi (Empty) và dữ liệu trả về có cấu trúc ra sao (TaskList chứa các Task).

Hàm grpc.loadPackageDefinition() dịch cấu trúc này thành các đối tượng JavaScript/TypeScript mà mã nguồn có thể hiểu được.

Bước 2: Khởi động Server (gRpcServer.ts)
Server tạo một instance mới: const server = new grpc.Server().

Đăng ký logic xử lý cho dịch vụ thông qua server.addService():

Liên kết TaskService với hàm handler GetTasks mà bạn đã viết.

Server mở cổng lắng nghe tại địa chỉ 0.0.0.0:50051 bằng lệnh server.bindAsync(). Từ lúc này, server chính thức sẵn sàng nhận các kết nối từ phía client.

Bước 3: Client gửi yêu cầu (Request)
Khi Client khởi chạy, nó khởi tạo kết nối đến server thông qua địa chỉ localhost:50051 bằng thông tin xác thực không bảo mật (grpc.credentials.createInsecure()).

Client gọi phương thức client.GetTasks({}, callback):

Vì phương thức này trong file .proto nhận đầu vào là message Empty (không có trường nào), nên client truyền vào một object rỗng {}.

Bước 4: Server xử lý yêu cầu (Handler Execution)
Khi có request gọi tới GetTasks, gRPC Server tự động kích hoạt hàm xử lý GetTasks(call, callback) phía server:

Hàm gọi randomTask() 5 lần để tạo ra một mảng gồm 5 công việc ngẫu nhiên (có id, title, và completed).

Đóng gói dữ liệu vào cấu trúc khớp với message TaskList: { tasks: generateTasks }.

Bước 5: Server trả kết quả (Response) về cho Client
Server gọi hàm callback(null, { tasks: generateTasks }):

Tham số thứ nhất (null): Biểu thị không có lỗi xảy ra. Nếu có lỗi, server sẽ truyền đối tượng Error vào đây.

Tham số thứ hai: Dữ liệu phản hồi (TaskList) được hệ thống gRPC tự động chuyển đổi (serialize) từ object JavaScript thành dữ liệu nhị phân (Protobuf binary) và truyền qua mạng về cho Client.