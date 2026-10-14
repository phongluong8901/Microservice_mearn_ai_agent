import amqp from "amqplib";

let channel: amqp.Channel;

export function getChannel(): amqp.Channel {
    if (!channel) {
        throw new Error("RabbitMQ channel has not been initialized yet!");
    }
    return channel;
}

export async function connectRabbitMQ(maxRetries = 10, retryDelayMs = 3000): Promise<void> {
    const rabbitUrl = process.env.RabbitMQ_URL;

    if (!rabbitUrl) {
        console.error("RabbitMQ Error: RabbitMQ_URL environment variable is missing");
        process.exit(1);
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Connecting to RabbitMQ (attempt ${attempt}/${maxRetries})...`);
            const connection = await amqp.connect(rabbitUrl);

            connection.on("error", (err) => {
                console.error("RabbitMQ runtime error: ", err.message);
            });

            connection.on("close", () => {
                console.error("RabbitMQ connection closed! Exiting application...");
                process.exit(1);
            });

            channel = await connection.createChannel();

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