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

2. gRPC trong Node.js

gRPC trên nền tảng Node.js không chỉ hỗ trợ Unary RPC (1 request - 1 response) mà còn hỗ trợ các mô hình phức tạp hơn như:

Server Streaming: Client gửi 1 request, Server trả về một luồng (stream) nhiều response liên tục.

Client Streaming: Client gửi một luồng dữ liệu, Server xử lý và trả về 1 response.

Bidirectional Streaming: Cả hai bên đều gửi dữ liệu qua lại liên tục dưới dạng stream.

Vì mô hình stream có thể trả về nhiều lần (nhiều response cho một request), lệnh return thông thường chỉ cho phép hàm kết thúc và trả về giá trị đúng một lần duy nhất. Do đó, gRPC dùng callback (hoặc stream object) để đồng bộ hóa cho tất cả các loại mô hình gọi hàm này, giữ cho thiết kế API của thư viện được đồng nhất.

3. Design Pattern (Mẫu thiết kế)
Vấn đề thực tế (Tại sao lại cần instance?)

const service1 = new UserService();
const service2 = new UserService();

Mỗi lần gọi new, máy tính sẽ cấp phát một vùng nhớ mới hoàn toàn. Bạn sẽ có nhiều bản thể (instance) khác nhau của cùng một class UserService nằm ở các ô nhớ khác nhau.

Nếu class này dùng để kết nối Database hoặc xử lý logic nặng, việc tạo ra hàng loạt đối tượng sẽ làm tốn bộ nguyên liệu (RAM) và lãng phí tài nguyên.

=> Giải pháp: Singleton Pattern
Singleton là mẫu thiết kế đảm bảo rằng một class chỉ có DUY NHẤT MỘT thể hiện (instance) duy nhất trong toàn bộ ứng dụng, và cung cấp một điểm truy cập toàn cục tới thể hiện đó.

private static instance: UserService;

private: Chặn không cho bên ngoài (hoặc các class khác) dùng lệnh new UserService() tùy tiện.

static: Biến này thuộc về riêng cái class UserService đó, chứ không thuộc về một đối tượng cụ thể nào cả. Nó nằm cố định một chỗ trong suốt vòng đời của ứng dụng.

instance: UserService: Nơi lưu giữ cái "bản thể duy nhất" được tạo ra lần đầu tiên.

4. Promise<IUser>
Trong ngữ cảnh của đoạn code trên, Promise không phải là một kiểu dữ liệu thông thường (như string, number hay boolean), mà nó là một kiểu dữ liệu đại diện cho một tác vụ bất đồng bộ (asynchronous operation) sẽ trả kết quả trong tương lai.

"Hàm này khi được gọi sẽ chạy bất đồng bộ (ví dụ: đang kết nối cơ sở dữ liệu để lưu user). Khi nó hoàn thành thành công, nó sẽ trả về một kết quả có kiểu dữ liệu là IUser (thông tin chi tiết của người dùng vừa đăng ký)."


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


--- work flow khi resign (rabbitmq + send mail + grpc)
1. Workflow Đăng Ký Tài Khoản (Register)Luồng này kết hợp giữa Gateway Service, Auth Service (gRPC), MongoDB, và RabbitMQ (để kích hoạt gửi email ngầm).Client Gửi Request: Người dùng gửi yêu cầu HTTP POST /api/v1/register kèm theo email và password tới Gateway Service.Gateway Chuyển Tiếp (gRPC Client): Gateway nhận request, gọi hàm registerUsergRPC, sử dụng gRPC Client để gửi thông tin qua cổng 50053 tới Auth Service.Xử Lý Nghiệp Vụ tại Auth Service:Validate Dữ Liệu: Kiểm tra tính hợp lệ của email và password bằng userInputSchema (Zod).Kiểm Tra Trùng Lặp: Gọi UserService tìm kiếm xem email đã tồn tại trong cơ sở dữ liệu MongoDB chưa. Nếu có $\rightarrow$ ném lỗi.Sinh Dữ Liệu Bảo Mật:Tạo mã OTP ngẫu nhiên dài 7 ký tự (generateOTP).Mã hóa mật khẩu bằng bcrypt (hashPassword).Lưu Database: Lưu thông tin user mới vào MongoDB với trạng thái email ban đầu là INVALID_EMAIL (chưa xác thực) và lưu mã OTP vừa tạo.Phát Sự Kiện qua RabbitMQ:Auth Service gọi hàm publishEvent("user.created", { userId, email, otpCode }).Tin nhắn được đẩy lên Exchange user.events (kiểu topic) với routing key user.created.Phản Hồi Client: Auth Service trả về kết quả thành công qua gRPC $\rightarrow$ Gateway Service nhận được và trả response về cho HTTP Client: "We sent to your an email verify...".Xử Lý Sự Kiện Ngầm tại Notification Service:Hàng đợi email.notification đã liên kết (bind) với exchange user.events qua routing key user.created sẽ nhận được tin nhắn.Notification Service tiêu thụ (consume) tin nhắn, gọi dịch vụ sendEmail sử dụng Nodemailer để gửi email chứa mã OTP đến hộp thư của người dùng.Nếu gửi thành công $\rightarrow$ gửi tín hiệu channel.ack(msg) để xóa tin nhắn khỏi hàng đợi.

2. Workflow Xác Thực Email (Verify Email)
Luồng này xử lý việc người dùng nhập mã OTP nhận được từ email để kích hoạt tài khoản.

Client Gửi Request: Người dùng gửi HTTP POST /api/v1/verify-email kèm email và otpCode tới Gateway Service.

Gateway Chuyển Tiếp (gRPC): Gateway chuyển tiếp yêu cầu này xuống Auth Service thông qua gRPC (verifyUserEmailgRPC).

Xử Lý tại Auth Service:

Tìm Kiếm User: verifyUserEmailController gọi UserService tìm user dựa trên email.

So Sánh Mã OTP: Kiểm tra xem otpCode người dùng gửi lên có khớp với otpCode đang lưu trong MongoDB hay không (hỗ trợ so sánh cả dạng chuỗi trực tiếp lẫn ép kiểu số nguyên).

Cập Nhật Trạng Thái:

Nếu khớp: Gọi validateUserEmail để cập nhật trường isValidEmail thành VALID_EMAIL (đã xác thực). Trả về kết quả thành công (success: true).

Nếu không khớp hoặc không tìm thấy user: Trả về thông báo lỗi (Invalid OTP code hoặc User not found, success: false).

Phản Hồi Client: Kết quả được truyền ngược qua gRPC lên Gateway và trả về cho HTTP Client.

3. Workflow Đăng Nhập (Login)Luồng này cho phép người dùng đã xác thực email truy cập hệ thống và nhận về cặp token bảo mật.Client Gửi Request: Người dùng gửi HTTP POST /api/v1/login kèm email và password tới Gateway Service.Gateway Chuyển Tiếp (gRPC): Gateway gọi loginUsergRPC để chuyển tiếp thông tin đăng nhập sang Auth Service.Xử Lý tại Auth Service:Validate Dữ Liệu: Kiểm tra định dạng đầu vào bằng Zod schema.Kiểm Tra Tài Khoản: Tìm user theo email. Nếu không tồn tại $\rightarrow$ báo lỗi Invalid Email or Password.Kiểm Tra Trạng Thái Xác Thực: Kiểm tra trường isValidEmail. Nếu tài khoản chưa xác thực (VALID_EMAIL) $\rightarrow$ ném lỗi yêu cầu xác thực email trước khi đăng nhập.So Sánh Mật Khẩu: Sử dụng bcrypt.compare (comparePassword) để đối chiếu mật khẩu thô người dùng nhập với mật khẩu đã băm trong DB.Tạo Tokens & Đóng Gói Dữ Liệu (authData):Nếu mật khẩu chính xác, tạo đồng thời Access Token (ngắn hạn, 1 giờ) và Refresh Token (dài hạn) ký bằng các khóa bí mật riêng biệt từ biến môi trường (JWT_TOKEN_KEY, REFRESH_TOKEN_KEY).Loại bỏ trường mật khẩu ra khỏi đối tượng trả về để đảm bảo bảo mật.Đóng gói cấu trúc gồm thông tin token (accessToken, refreshToken), thông tin user, và cờ isLoggedIn: true.Phản Hồi Client: Auth Service trả dữ liệu này qua gRPC $\rightarrow$ Gateway nhận và trả về dưới dạng JSON cho HTTP Client.