import mongoose from "mongoose";

export async function dbConnection() {
    console.log('db ', process.env.DB_URL);

    mongoose
        .connect(process.env.DB_URL as string)
        .then(() => console.log("Db connection success"))
        .catch((error: any) => console.log("Db connection failed", (error)?.message))
}