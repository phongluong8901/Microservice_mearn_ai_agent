import { Router, Express } from "express";
import { authRoutes } from "./auth/authRoutes";

// Khai báo hàm thiết lập nhóm API phiên bản v1 nhận vào ứng dụng Express và đối tượng Router
export function apiV1(app: Express, router: Router) {
    // Gọi hàm authRoutes truyền vào router để khởi tạo các đường dẫn liên quan đến xác thực
    const auth = authRoutes(router)

    app.use('/api/v1', auth) // Gắn tiền tố đường dẫn '/api/v1' vào tất cả các route
}