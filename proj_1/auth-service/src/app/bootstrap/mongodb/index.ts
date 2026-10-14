import mongoose from "mongoose";

// Khai báo hàm bất đồng bộ (async) để thực hiện kết nối cơ sở dữ liệu
export async function dbConnection() {
    console.log('db ', process.env.DB_URL);

    mongoose
        .connect(process.env.DB_URL as string) // Gọi hàm connect truyền vào chuỗi kết nối MongoDB
        .then(() => console.log("Db connection success")) // In thông báo thành công ra console
        .catch((error: any) => console.log("Db connection failed", (error)?.message))
}