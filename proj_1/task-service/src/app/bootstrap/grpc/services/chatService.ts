
import { PORT } from "@/index";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

export async function Chat(call: grpc.ServerWritableStream<any, any>) {
    const { userId, message } = call.request;
    const graphStream = await graph.stream(
        {
            messaegs: [{ role: "user", content: message }],
            userId
        },
        {
            streamMode: "custom",
            subgraphs: true,
            recursionLimit: 400,
            configurable: {
                userId
            }
        }
    )
}