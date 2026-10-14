import bcrypt from "bcrypt";

// Khai báo hàm bất đồng bộ nhận vào mật khẩu dạng văn bản thuần (plain text) để mã hóa
async function hashPassword(pwd: string) {
    const saltRounds = 10; // Định nghĩa số vòng lặp tạo độ phức tạp (salt rounds)
    const hashPwd = await bcrypt.hash(pwd, saltRounds); // Thực hiện băm chuỗi mật khẩu thô kết hợp với salt
    return hashPwd
}

// Khai báo hàm bất đồng bộ dùng để đối chiếu mật khẩu khi đăng nhập
async function comparePassword(plainTextPwd: string, hashPwd: string) {
    // So sánh mật khẩu thô người dùng nhập vào với chuỗi mật khẩu đã mã hóa trong DB
    const isValid = await bcrypt.compare(plainTextPwd, hashPwd);
    return isValid ? true : false
}

export {
    hashPassword,
    comparePassword
}