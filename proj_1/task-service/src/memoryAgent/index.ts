import { createAgent } from "langchain";
import { MEMORY_BASE_SYSTEM_PROMPT } from "./prompt/memo-prompt";

export async function memoAgent({
    model = "",
    modelContentLimit = 8000,
    userId = "",
} = {}) {
    const agent = createAgent({
        model,
        tools: [],
        systemPrompt: MEMORY_BASE_SYSTEM_PROMPT,
        middleware: []
    });

    async function streamAgent(userInput: string, config: { writer: (data: { manager_name: string; content: string }) => void }) {
        // Write to chat history (placeholder for your DB logic)
        let fullContent = "";

        const stream = await agent.streamEvents(
            { messages: [{ role: "user", content: userInput }] },
            { version: "v3" }
        );

        for await (const message of stream.messages) {
            // Stream reasoning/thinking tokens if supported by the model
            for await (const delta of message.reasoning) {
                const aiThinking = `<think>${delta}</think>`;
                fullContent += aiThinking;
                config.writer({
                    manager_name: "memoryManager",
                    content: aiThinking
                });
            }

            // Stream standard text content tokens
            for await (const delta of message.text) {
                fullContent += delta;
                config.writer({
                    manager_name: "memoryManager",
                    content: delta
                });
            }
        }

        // write to chat history
        return fullContent;
    }

    return {
        streamAgent
    };
}