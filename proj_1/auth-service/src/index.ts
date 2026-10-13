import express from 'express';
import 'dotenv/config'
import { bootStrapApp } from './app/bootstrap';

// Khởi tạo một instance ứng dụng Express
const app = express()

const PORT = parseInt(process.env.PORT as string)

// Gọi hàm khởi động ứng dụng
bootStrapApp(app, PORT)


// interface Empty { }

// interface Task {
//     id: number
//     title: string
//     completed: boolean
// }

// interface TaskList {
//     tasks: Task[]
// }

// class TaskService {
//     GetTasks(prop: Empty): TaskList {
//         return { tasks: [{ id: 1, title: "", completed: false }] }
//     }
// }
