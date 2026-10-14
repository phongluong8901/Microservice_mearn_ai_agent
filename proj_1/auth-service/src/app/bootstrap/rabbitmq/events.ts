import { getChannel } from ".";

export function publishEvent(
    routingKey: string,
    data: any,
) {
    const channel = getChannel();
    channel.publish(
        "user.events",
        routingKey,
        Buffer.from(JSON.stringify(data))
    );
}