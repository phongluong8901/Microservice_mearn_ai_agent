import amqp from "amqplib";
import { sendEmail } from "../../../email/email.notification";

let channel: amqp.Channel;

export async function connectRabbitMQ(maxRetries = 30, retryDelayMs = 3000): Promise<void> {
    const rabbitUrl = process.env.RabbitMQ_URL;

    if (!rabbitUrl) {
        console.error("RabbitMQ Error: RabbitMQ_URL environment variable is missing");
        process.exit(1);
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Connecting to RabbitMQ (attempt ${attempt}/${maxRetries})...`);
            const connection = await amqp.connect(rabbitUrl);

            connection.on("error", (err) => {
                console.error("RabbitMQ runtime error: ", err.message);
            });

            connection.on("close", () => {
                console.error("RabbitMQ connection closed! Exiting application...");
                process.exit(1);
            });

            // Tạo một channel mới từ kết nối thành công
            channel = await connection.createChannel();

            // Khởi tạo (khai báo) Exchange kiểu topic tên là "user.events" (durable: true giúp lưu trữ bền vững qua các lần khởi động lại)
            await channel.assertExchange("user.events", "topic", {
                durable: true,
            });

            // Khởi tạo một hàng đợi (queue) có tên "email.notification" (durable: true giúp giữ lại tin nhắn khi broker khởi động lại) a queue
            const queue = await channel.assertQueue("email.notification", {
                durable: true
            });

            // Bind an event to the queue
            // Liên kết (bind) hàng đợi "email.notification" vào exchange "user.events" với routing key là "user.created" để nhận sự kiện người dùng mới đăng ký
            await channel.bindQueue(queue.queue, "user.events", "user.created");

            // Bắt đầu tiêu thụ (consume) tin nhắn từ hàng đợi "email.notification" một cách bất đồng bộ
            channel.consume(queue.queue, async (msg: any) => {
                if (!msg) return;
                try {
                    // Chuyển đổi nội dung tin nhắn nhị phân từ Buffer sang chuỗi JSON, sau đó parse thành đối tượng JS
                    const data = JSON.parse(msg.content.toString());

                    // Gọi hàm gửi email xác thực chứa mã OTP đến email của người dùng
                    await sendEmail(data?.email, data?.otpCode);

                    console.log("Sending email: ", data.email);
                    // send email here
                    channel.ack(msg); // Gửi xác nhận (Acknowledge) về RabbitMQ rằng tin nhắn đã được xử lý thành công để hệ thống xóa nó khỏi hàng đợi
                } catch (err) {
                    console.error("Failed to process email message:", err);
                    channel.nack(msg, false, false);
                }
            });

            console.log("RabbitMQ connected and exchange asserted.");
            return;
        } catch (error: any) {
            console.error(`RabbitMQ connection attempt ${attempt} failed:`, error?.message || error);
            if (attempt === maxRetries) {
                console.error("Could not connect to RabbitMQ after max retries. Exiting...");
                process.exit(1);
            }
            // Chờ một khoảng thời gian (3 giây) trước khi thử kết nối lại
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
    }
}