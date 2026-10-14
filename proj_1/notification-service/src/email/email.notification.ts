import nodemailer from 'nodemailer';

//loking to send email in production . checkout email API/SMTP product
// Tạo một đối tượng vận chuyển (transporter) để cấu hình kết nối tới máy chủ SMTP
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT as string),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
});

// Hàm bất đồng bộ xuất ra dùng để gửi email xác thực nhận vào email người nhận và mã OTP
export async function sendEmail(receiverEmail: string, optCode: number) {
    const info = await transporter.sendMail({
        from: "From Microservice app",
        to: receiverEmail,
        subject: "Verification your E-mail",
        text: "use this code to verify your email address: " + optCode,
        html: `
        <div>
            <h1>Your One Time Password is: ${optCode}</h1>
            <p>This code will expire in 10 minutes</p>
        </div>
        `
    }).catch((error: any) => console.log("failed to send email verification:", error))
}