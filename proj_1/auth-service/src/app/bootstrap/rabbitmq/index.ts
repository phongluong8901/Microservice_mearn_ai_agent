import amqp from "amqplib";

// Khai báo biến toàn cục lưu trữ channel RabbitMQ để sử dụng chung cho việc gửi/nhận message
let channel: amqp.Channel;

// Hàm công khai dùng để lấy channel hiện tại
export function getChannel(): amqp.Channel {
    if (!channel) {
        throw new Error("RabbitMQ channel has not been initialized yet!");
    }
    return channel;
}

// Hàm bất đồng bộ thiết lập kết nối tới RabbitMQ với cơ chế thử lại (retry) khi thất bại
export async function connectRabbitMQ(maxRetries = 30, retryDelayMs = 3000): Promise<void> {
    // Lấy chuỗi kết nối (connection string) của RabbitMQ từ biến môi trường
    const rabbitUrl = process.env.RabbitMQ_URL;

    if (!rabbitUrl) {
        console.error("RabbitMQ Error: RabbitMQ_URL environment variable is missing");
        process.exit(1);
    }

    // Vòng lặp thực hiện kết nối lại tối đa theo số lần quy định (mặc định 30 lần)
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Connecting to RabbitMQ (attempt ${attempt}/${maxRetries})...`);
            // Thực hiện thiết lập kết nối TCP tới server RabbitMQ
            const connection = await amqp.connect(rabbitUrl);

            // Lắng nghe sự kiện lỗi xảy ra trong suốt vòng đời kết nối
            connection.on("error", (err) => {
                console.error("RabbitMQ runtime error: ", err.message);
            });

            // Lắng nghe sự kiện kết nối bị đóng đột ngột
            connection.on("close", () => {
                console.error("RabbitMQ connection closed! Exiting application...");
                process.exit(1); // Thoát ứng dụng khi mất kết nối với broker
            });

            // Tạo một channel mới từ kết nối thành công
            channel = await connection.createChannel();

            // Khởi tạo (khai báo) một Exchange kiểu topic tên là "user.events" (durable: true giúp lưu trữ bền vững qua các lần khởi động lại broker)
            await channel.assertExchange("user.events", "topic", {
                durable: true
            });

            console.log("RabbitMQ connected successfully.");
            console.log("Exchange 'user.events' asserted.");
            return;
        } catch (error: any) {
            console.error(`RabbitMQ connection attempt ${attempt} failed:`, error?.message || error);
            if (attempt === maxRetries) {
                console.error("Could not connect to RabbitMQ after max retries. Exiting...");
                process.exit(1);
            }
            await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        }
    }
}

export { channel };