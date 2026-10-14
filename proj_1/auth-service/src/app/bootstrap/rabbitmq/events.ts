import { getChannel } from ".";

// Khai báo hàm dùng để phát/gửi sự kiện (event) lên RabbitMQ message broker
export function publishEvent(
    routingKey: string, // Tham số định nghĩa khóa định tuyến (routing key) để phân loại event (ví dụ: "user.register", "user.login")
    data: any, // Tham số chứa dữ liệu payload (đối tượng bất kỳ) cần gửi đi kèm theo sự kiện
) {
    // Lấy channel RabbitMQ đã được khởi tạo
    const channel = getChannel();
    // Gọi phương thức publish của channel để đẩy message lên một Exchange
    channel.publish(
        "user.events", // Tên của exchange đích mà message sẽ được gửi tới
        routingKey, // Truyền routingKey để RabbitMQ dựa vào đó chuyển message tới các hàng đợi (queue) phù hợp
        Buffer.from(JSON.stringify(data)) // Chuyển đổi đối tượng dữ liệu JS thành chuỗi JSON, sau đó ép kiểu thành Buffer (vì RabbitMQ nhận dữ liệu dạng nhị phân)
    );
}