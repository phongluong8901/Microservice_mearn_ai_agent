import express, { response, Router } from 'express';
import cors from 'cors';
import { Express, Response, Request } from "express";
import path from 'node:path';
import { handleExpressError } from '../exceptions/handleExpressError';
import { allTask } from '../grpc/gRPCClient';

export function expressServer(app: Express, PORT: number) {
    // Khởi tạo một đối tượng router phụ
    const router = Router()

    // Cấu hình và kích hoạt CORS
    app.use(cors({
        origin: process.env.FRONT_APP_URL,
        credentials: true, // Cho phép trình duyệt gửi kèm cookie/token xác thực trong request CORS
    }));

    app.use(express.json()); // Middleware phân tích cú pháp body của request dạng JSON
    app.use(express.urlencoded({ extended: true })); // Middleware phân tích cú pháp dữ liệu gửi lên từ form (URL-encoded)
    app.use('/assets', express.static(path.join(process.cwd(), 'public'))); // Cấu hình phục vụ các tệp tĩnh (ảnh, CSS, JS) từ thư mục 'public' thông qua tiền tố đường dẫn

    app.get('/', async (req: Request, res = response) => {
        res.json({ message: "server is up" })
    });

    app.get('/tasks', async (req: Request, res: Response, next) => {
        try {
            const tasks = await allTask()
            res.json({ tasks })
        } catch (error) {
            next(error)
        }
    })

    app.use(handleExpressError) // Đăng ký middleware xử lý lỗi chung (phải đặt sau các route)

    app.listen(PORT, () => {
        console.log(`Express server is runing at http://localhost:${PORT}`)
    });


}